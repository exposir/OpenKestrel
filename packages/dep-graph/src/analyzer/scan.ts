/**
 * - [INPUT]: 依赖文件系统、es-module-lexer 与 ts resolver 能力
 * - [OUTPUT]: 提供文件扫描结果、节点元数据与边候选集合
 * - [POS]: analyzer 主执行层，负责高性能扫描与依赖抽取
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../../CLAUDE.md
 */

import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { init, parse } from "es-module-lexer";
import ts from "typescript";

import type { AnalyzeOptions, AnalysisWarning, EdgeKind } from "../types";
import { isSupportedCodeFile, normalizeAbsolutePath, toRelativePath } from "./path-utils";
import type { TsContext } from "./tsconfig";

export interface ScannedNode {
  id: number;
  absPath: string;
  relPath: string;
  ext: string;
  sizeBytes: number;
}

export interface ScannedEdge {
  from: number;
  to: number;
  kind: EdgeKind;
  external: boolean;
  targetExternalName?: string;
}

export interface ScanResult {
  nodes: ScannedNode[];
  edges: ScannedEdge[];
  warnings: AnalysisWarning[];
  externalRefsByNode: Map<number, number>;
}

interface CacheImportItem {
  importPath: string;
  kind: Exclude<EdgeKind, "typeOnly">;
}

interface ScanCacheFile {
  version: string;
  files: Record<
    string,
    {
      mtimeMs: number;
      size: number;
      imports: CacheImportItem[];
    }
  >;
}

const DEFAULT_INCLUDE = ["**/*.{ts,tsx,js,jsx,mjs,cjs}"];
const DEFAULT_IGNORE = [
  "**/node_modules/**",
  "**/.git/**",
  "**/.next/**",
  "**/dist/**",
  "**/build/**",
  "**/coverage/**"
];

export async function scanProject(
  root: string,
  tsContext: TsContext,
  options: AnalyzeOptions
): Promise<ScanResult> {
  await init;

  const includePatterns = options.includePatterns ?? DEFAULT_INCLUDE;
  const ignorePatterns = options.ignorePatterns ?? DEFAULT_IGNORE;

  const entries = await fg(includePatterns, {
    cwd: root,
    absolute: true,
    onlyFiles: true,
    dot: false,
    ignore: ignorePatterns
  });

  const supported = entries
    .map((entry) => normalizeAbsolutePath(entry))
    .filter((entry) => isSupportedCodeFile(entry));

  const nodes: ScannedNode[] = [];
  const warnings: AnalysisWarning[] = [];
  const pathToId = new Map<string, number>();

  const cacheRoot = options.cacheDir ?? path.join(root, ".okdep/cache");
  const cacheFilePath = path.resolve(cacheRoot, "scan-cache.json");
  const cache = await loadCache(cacheFilePath);
  const nextCache: ScanCacheFile = {
    version: "1",
    files: {}
  };

  for (const absPath of supported) {
    try {
      const stat = await fs.stat(absPath);
      const id = nodes.length;
      const relPath = toRelativePath(root, absPath);
      pathToId.set(absPath, id);
      nodes.push({
        id,
        absPath,
        relPath,
        ext: path.extname(absPath).toLowerCase(),
        sizeBytes: stat.size
      });

      nextCache.files[absPath] = {
        mtimeMs: stat.mtimeMs,
        size: stat.size,
        imports: []
      };
    } catch (error) {
      warnings.push({
        type: "skip",
        filePath: toRelativePath(root, absPath),
        detail: `stat failed: ${String(error)}`
      });
    }
  }

  const edges: ScannedEdge[] = [];
  const externalRefsByNode = new Map<number, number>();

  for (const node of nodes) {
    const nodeCache = nextCache.files[node.absPath];
    const previous = cache?.files[node.absPath];
    let parsedImports: CacheImportItem[] = [];

    if (previous && nodeCache && previous.mtimeMs === nodeCache.mtimeMs && previous.size === nodeCache.size) {
      parsedImports = previous.imports;
    } else {
      let sourceText: string;
      try {
        sourceText = await fs.readFile(node.absPath, "utf8");
      } catch (error) {
        warnings.push({
          type: "skip",
          filePath: node.relPath,
          detail: `read failed: ${String(error)}`
        });
        continue;
      }

      let imports: readonly import("es-module-lexer").ImportSpecifier[];
      try {
        imports = parse(sourceText)[0];
      } catch (error) {
        warnings.push({
          type: "fallback",
          filePath: node.relPath,
          detail: `es-module-lexer failed: ${String(error)}`
        });
        continue;
      }

      parsedImports = [];
      for (const item of imports) {
        const raw = sourceText.slice(item.s, item.e).trim();
        if (!raw) {
          continue;
        }
        const importPath = raw.replace(/^['"]|['"]$/g, "");
        const kind: Exclude<EdgeKind, "typeOnly"> =
          item.d > -1 ? "dynamic" : item.t === 1 ? "static" : "reexport";
        parsedImports.push({ importPath, kind });
      }
    }

    if (nodeCache) {
      nodeCache.imports = parsedImports;
    }

    for (const item of parsedImports) {
      const isExternal = !item.importPath.startsWith(".") && !item.importPath.startsWith("/");

      if (isExternal) {
        edges.push({
          from: node.id,
          to: -1,
          kind: item.kind,
          external: true,
          targetExternalName: item.importPath
        });
        externalRefsByNode.set(node.id, (externalRefsByNode.get(node.id) ?? 0) + 1);
        continue;
      }

      const resolved = resolveInternalImport(item.importPath, node.absPath, pathToId, tsContext);
      if (resolved == null) {
        warnings.push({
          type: "unresolved",
          filePath: node.relPath,
          detail: item.importPath
        });
        continue;
      }

      edges.push({
        from: node.id,
        to: resolved,
        kind: item.kind,
        external: false
      });
    }
  }

  await saveCache(cacheFilePath, nextCache);

  return {
    nodes,
    edges,
    warnings,
    externalRefsByNode
  };
}

function resolveInternalImport(
  importPath: string,
  containingFile: string,
  pathToId: Map<string, number>,
  tsContext: TsContext
): number | null {
  const basedir = path.dirname(containingFile);

  const fastCandidates = buildFastCandidates(basedir, importPath);
  for (const candidate of fastCandidates) {
    const normalized = normalizeAbsolutePath(candidate);
    const id = pathToId.get(normalized);
    if (id != null) {
      return id;
    }
  }

  const tsResolved = ts.resolveModuleName(importPath, containingFile, tsContext.options, tsContext.host);
  const resolvedFile = tsResolved.resolvedModule?.resolvedFileName;
  if (!resolvedFile) {
    return null;
  }

  const normalized = normalizeAbsolutePath(stripDtsVariant(resolvedFile));
  return pathToId.get(normalized) ?? null;
}

function buildFastCandidates(baseDir: string, importPath: string): string[] {
  const target = path.resolve(baseDir, importPath);
  const ext = path.extname(target);
  if (ext) {
    return [target];
  }

  const exts = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];
  const candidates: string[] = [];
  for (const item of exts) {
    candidates.push(`${target}${item}`);
  }
  for (const item of exts) {
    candidates.push(path.join(target, `index${item}`));
  }
  return candidates;
}

function stripDtsVariant(filePath: string): string {
  if (filePath.endsWith(".d.ts")) {
    return filePath.slice(0, -5) + ".ts";
  }
  if (filePath.endsWith(".d.mts")) {
    return filePath.slice(0, -6) + ".mts";
  }
  if (filePath.endsWith(".d.cts")) {
    return filePath.slice(0, -6) + ".cts";
  }
  return filePath;
}

async function loadCache(cachePath: string): Promise<ScanCacheFile | null> {
  try {
    const content = await fs.readFile(cachePath, "utf8");
    const parsed = JSON.parse(content) as ScanCacheFile;
    if (parsed.version !== "1") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function saveCache(cachePath: string, cache: ScanCacheFile): Promise<void> {
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  await fs.writeFile(cachePath, JSON.stringify(cache), "utf8");
}
