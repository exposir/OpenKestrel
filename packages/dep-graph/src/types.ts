/**
 * - [INPUT]: 依赖 dep-graph 分析与可视化需求定义
 * - [OUTPUT]: 导出分析器/图算法/Viewer 共享类型契约
 * - [POS]: @openkestrel/dep-graph 类型中心，统一公共接口边界
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
 */

export type EdgeKind = "static" | "dynamic" | "reexport" | "typeOnly";

export interface AnalyzeOptions {
  root?: string;
  outFile?: string;
  cacheDir?: string;
  includePatterns?: string[];
  ignorePatterns?: string[];
  includeExternal?: boolean;
  aggregateDepth?: number;
  meshPercentile?: number;
}

export interface FileNode {
  id: number;
  path: string;
  ext: string;
  sizeBytes: number;
  inDegree: number;
  outDegree: number;
  meshScore: number;
  externalRefsCount: number;
}

export interface DependencyEdge {
  from: number;
  to: number;
  kind: EdgeKind;
  external: boolean;
}

export interface CycleGroup {
  id: number;
  nodeIds: number[];
  size: number;
}

export interface MeshNode {
  nodeId: number;
  inDegree: number;
  outDegree: number;
  score: number;
  percentileIn: number;
  percentileOut: number;
}

export interface AggregateNode {
  id: string;
  label: string;
  fileCount: number;
  sizeBytes: number;
}

export interface AggregateEdge {
  from: string;
  to: string;
  weight: number;
}

export interface AnalysisWarning {
  type: "unresolved" | "fallback" | "skip";
  filePath: string;
  detail: string;
}

export interface AnalysisReport {
  meta: {
    root: string;
    generatedAt: string;
    durationMs: number;
    fileCount: number;
    edgeCount: number;
    version: string;
  };
  nodes: FileNode[];
  edges: DependencyEdge[];
  cycles: CycleGroup[];
  mesh: MeshNode[];
  aggregates: {
    nodes: AggregateNode[];
    edges: AggregateEdge[];
    depth: number;
  };
  closureSizeByNode: Record<number, number>;
  warnings: AnalysisWarning[];
}

export interface ViewerOptions {
  port?: number;
  host?: string;
  openBrowser?: boolean;
}

export interface ViewerHandle {
  url: string;
  close: () => Promise<void>;
}
