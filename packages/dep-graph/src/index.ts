/**
 * - [INPUT]: 依赖 analyzer/graph/viewer-server 各子模块实现
 * - [OUTPUT]: 导出 dep-graph SDK 的稳定公共 API 与类型
 * - [POS]: @openkestrel/dep-graph 默认入口，供外部程序化调用
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
 */

export { analyzeProject } from "./analyzer/index";
export { findCycles, findMeshNodes, computeClosureSizes } from "./graph/algorithms";
export { startViewer } from "./viewer-server/index";

export type {
  AnalyzeOptions,
  AnalysisReport,
  AnalysisWarning,
  FileNode,
  DependencyEdge,
  CycleGroup,
  MeshNode,
  ViewerHandle,
  ViewerOptions
} from "./types";
