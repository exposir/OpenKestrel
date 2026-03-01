#!/usr/bin/env node
/**
 * - [INPUT]: 依赖 commander、分析器与 viewer-server 导出的能力
 * - [OUTPUT]: 提供 okdep CLI（analyze/web/print-cycles/print-mesh）
 * - [POS]: dep-graph 命令行入口，面向一键分析与可视化启动
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
 */

import fs from "node:fs/promises";
import path from "node:path";

import { Command } from "commander";

import { analyzeProject } from "./analyzer/index";
import { startViewer } from "./viewer-server/index";
import type { AnalysisReport } from "./types";

const DEFAULT_REPORT = ".okdep/report.json";

export async function runCli(argv: string[]): Promise<void> {
  const program = new Command();
  program
    .name("okdep")
    .description("High-performance dependency graph analyzer for TS/JS projects")
    .version("0.1.0");

  program
    .command("analyze")
    .argument("[root]", "project root", ".")
    .option("--out <path>", "output report path", DEFAULT_REPORT)
    .option("--open", "open Web viewer after analysis", false)
    .option("--port <number>", "viewer port", (value) => Number(value), 4711)
    .option("--aggregate-depth <number>", "aggregate directory depth", (value) => Number(value), 2)
    .option("--mesh-percentile <number>", "mesh percentile threshold", (value) => Number(value), 90)
    .action(async (root: string, options) => {
      const report = await analyzeProject({
        root,
        outFile: options.out,
        aggregateDepth: options.aggregateDepth,
        meshPercentile: options.meshPercentile
      });

      printSummary(report);
      console.log(`[okdep] report written: ${path.resolve(options.out)}`);

      if (options.open) {
        const handle = await startViewer(report, {
          port: options.port,
          openBrowser: true
        });
        console.log(`[okdep] viewer: ${handle.url}`);
      }
    });

  program
    .command("web")
    .requiredOption("--report <path>", "report json path")
    .option("--port <number>", "viewer port", (value) => Number(value), 4711)
    .option("--open", "open browser", true)
    .action(async (options) => {
      const reportPath = path.resolve(options.report);
      const handle = await startViewer(reportPath, {
        port: options.port,
        openBrowser: options.open
      });
      console.log(`[okdep] viewer: ${handle.url}`);
    });

  program
    .command("print-cycles")
    .argument("[root]", "project root", ".")
    .option("--limit <number>", "max cycle groups", (value) => Number(value), 20)
    .action(async (root, options) => {
      const report = await analyzeProject({ root });
      const top = report.cycles.slice(0, options.limit);
      console.log(`[okdep] cycles: ${report.cycles.length}`);
      for (const group of top) {
        const names = group.nodeIds.map((id) => report.nodes[id]?.path ?? `${id}`);
        console.log(`\n#${group.id} (size=${group.size})`);
        for (const name of names) {
          console.log(`- ${name}`);
        }
      }
    });

  program
    .command("print-mesh")
    .argument("[root]", "project root", ".")
    .option("--limit <number>", "max mesh nodes", (value) => Number(value), 30)
    .action(async (root, options) => {
      const report = await analyzeProject({ root });
      const top = report.mesh.slice(0, options.limit);
      console.log(`[okdep] mesh nodes: ${report.mesh.length}`);
      for (const item of top) {
        const node = report.nodes[item.nodeId];
        if (!node) {
          continue;
        }
        console.log(
          `${node.path} | score=${item.score.toFixed(4)} | in=${item.inDegree} | out=${item.outDegree}`
        );
      }
    });

  await program.parseAsync(argv);
}

function printSummary(report: AnalysisReport): void {
  console.log("[okdep] analysis completed");
  console.log(`- root: ${report.meta.root}`);
  console.log(`- files: ${report.meta.fileCount}`);
  console.log(`- edges: ${report.meta.edgeCount}`);
  console.log(`- cycles: ${report.cycles.length}`);
  console.log(`- mesh: ${report.mesh.length}`);
  console.log(`- warnings: ${report.warnings.length}`);
  console.log(`- duration: ${report.meta.durationMs}ms`);
}

async function main(): Promise<void> {
  try {
    await runCli(process.argv);
  } catch (error) {
    console.error(`[okdep] failed: ${String(error)}`);
    process.exitCode = 1;
  }
}

const currentFile = path.resolve(process.argv[1] ?? "");
if (currentFile.endsWith("cli.js") || currentFile.endsWith("cli.ts")) {
  void main();
}

export async function loadReportFromFile(filePath: string): Promise<AnalysisReport> {
  const content = await fs.readFile(path.resolve(filePath), "utf8");
  return JSON.parse(content) as AnalysisReport;
}
