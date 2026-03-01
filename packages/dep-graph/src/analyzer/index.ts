/**
 * - [INPUT]: 依赖扫描器、ts 配置适配与图算法模块
 * - [OUTPUT]: 导出项目依赖分析主入口 analyzeProject
 * - [POS]: analyzer 编排层，构建最终 AnalysisReport
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../../CLAUDE.md
 */

import fs from "node:fs/promises";
import path from "node:path";

import type { AnalysisReport, AnalyzeOptions, DependencyEdge, FileNode } from "../types";
import { buildAggregates, computeClosureSizes, findCycles, findMeshNodes } from "../graph/algorithms";
import { normalizeAbsolutePath } from "./path-utils";
import { scanProject } from "./scan";
import { createTsContext } from "./tsconfig";

const REPORT_VERSION = "0.1.0";

export async function analyzeProject(options: AnalyzeOptions = {}): Promise<AnalysisReport> {
  const startedAt = Date.now();
  const root = normalizeAbsolutePath(options.root ?? process.cwd());
  const tsContext = createTsContext(root);
  const scan = await scanProject(root, tsContext, options);

  const nodes: FileNode[] = scan.nodes.map((node) => ({
    id: node.id,
    path: node.relPath,
    ext: node.ext,
    sizeBytes: node.sizeBytes,
    inDegree: 0,
    outDegree: 0,
    meshScore: 0,
    externalRefsCount: scan.externalRefsByNode.get(node.id) ?? 0
  }));

  const dedupEdges = deduplicateEdges(scan.edges);

  for (const edge of dedupEdges) {
    if (edge.external || edge.to < 0) {
      continue;
    }
    nodes[edge.from]!.outDegree += 1;
    nodes[edge.to]!.inDegree += 1;
  }

  const mesh = findMeshNodes(nodes, options.meshPercentile ?? 90);
  for (const item of mesh) {
    const node = nodes[item.nodeId];
    if (node) {
      node.meshScore = item.score;
    }
  }

  const cycles = findCycles(nodes, dedupEdges);
  const closureSizeByNode = computeClosureSizes(nodes, dedupEdges);
  const aggregates = buildAggregates(nodes, dedupEdges, options.aggregateDepth ?? 2);

  const report: AnalysisReport = {
    meta: {
      root,
      generatedAt: new Date().toISOString(),
      durationMs: Date.now() - startedAt,
      fileCount: nodes.length,
      edgeCount: dedupEdges.length,
      version: REPORT_VERSION
    },
    nodes,
    edges: dedupEdges,
    cycles,
    mesh,
    aggregates,
    closureSizeByNode,
    warnings: scan.warnings
  };

  if (options.outFile) {
    await writeReport(options.outFile, report);
  }

  return report;
}

export async function writeReport(outFile: string, report: AnalysisReport): Promise<void> {
  const normalized = path.resolve(outFile);
  await fs.mkdir(path.dirname(normalized), { recursive: true });
  await fs.writeFile(normalized, JSON.stringify(report, null, 2), "utf8");
}

function deduplicateEdges(
  edges: Array<{ from: number; to: number; kind: DependencyEdge["kind"]; external: boolean }>
): DependencyEdge[] {
  const seen = new Set<string>();
  const deduped: DependencyEdge[] = [];

  for (const edge of edges) {
    const key = `${edge.from}|${edge.to}|${edge.kind}|${edge.external ? 1 : 0}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push({
      from: edge.from,
      to: edge.to,
      kind: edge.kind,
      external: edge.external
    });
  }

  return deduped;
}
