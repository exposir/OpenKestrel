/**
 * - [INPUT]: 依赖节点与边的邻接信息
 * - [OUTPUT]: 提供 SCC、网状识别、闭包大小、聚合图算法
 * - [POS]: graph 算法层，承载依赖治理核心计算
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../../CLAUDE.md
 */

import type {
  AggregateEdge,
  AggregateNode,
  CycleGroup,
  DependencyEdge,
  FileNode,
  MeshNode
} from "../types";
import { aggregateKey } from "../analyzer/path-utils";

export function buildAdjacency(nodes: FileNode[], edges: DependencyEdge[]): number[][] {
  const adjacency = Array.from({ length: nodes.length }, () => [] as number[]);
  for (const edge of edges) {
    if (edge.external || edge.to < 0) {
      continue;
    }
    adjacency[edge.from]!.push(edge.to);
  }
  return adjacency;
}

export function findCycles(nodes: FileNode[], edges: DependencyEdge[]): CycleGroup[] {
  const adjacency = buildAdjacency(nodes, edges);
  const n = nodes.length;
  const indexByNode = new Array<number>(n).fill(-1);
  const lowLink = new Array<number>(n).fill(-1);
  const onStack = new Array<boolean>(n).fill(false);
  const stack: number[] = [];
  let index = 0;
  const result: CycleGroup[] = [];

  const strongConnect = (v: number): void => {
    indexByNode[v] = index;
    lowLink[v] = index;
    index += 1;
    stack.push(v);
    onStack[v] = true;

    for (const w of adjacency[v] ?? []) {
      if (indexByNode[w] === -1) {
        strongConnect(w);
        lowLink[v] = Math.min(lowLink[v]!, lowLink[w]!);
      } else if (onStack[w]) {
        lowLink[v] = Math.min(lowLink[v]!, indexByNode[w]!);
      }
    }

    if (lowLink[v] === indexByNode[v]) {
      const component: number[] = [];
      while (true) {
        const w = stack.pop();
        if (w == null) {
          break;
        }
        onStack[w] = false;
        component.push(w);
        if (w === v) {
          break;
        }
      }

      if (component.length > 1 || hasSelfLoop(v, adjacency)) {
        result.push({
          id: result.length,
          nodeIds: component.sort((a, b) => a - b),
          size: component.length
        });
      }
    }
  };

  for (let v = 0; v < n; v += 1) {
    if (indexByNode[v] === -1) {
      strongConnect(v);
    }
  }

  result.sort((a, b) => b.size - a.size);
  return result;
}

export function findMeshNodes(
  nodes: FileNode[],
  meshPercentile: number
): MeshNode[] {
  const inValues = nodes.map((node) => node.inDegree).sort((a, b) => a - b);
  const outValues = nodes.map((node) => node.outDegree).sort((a, b) => a - b);

  const inThreshold = percentileValue(inValues, meshPercentile);
  const outThreshold = percentileValue(outValues, meshPercentile);
  const maxIn = Math.max(1, inValues[inValues.length - 1] ?? 1);
  const maxOut = Math.max(1, outValues[outValues.length - 1] ?? 1);

  const mesh = nodes
    .filter((node) => node.inDegree >= inThreshold && node.outDegree >= outThreshold)
    .map((node) => {
      const percentileIn = rankPercentile(inValues, node.inDegree);
      const percentileOut = rankPercentile(outValues, node.outDegree);
      const score = (node.inDegree / maxIn) * (node.outDegree / maxOut);
      return {
        nodeId: node.id,
        inDegree: node.inDegree,
        outDegree: node.outDegree,
        score,
        percentileIn,
        percentileOut
      };
    })
    .sort((a, b) => b.score - a.score);

  return mesh;
}

export function computeClosureSizes(
  nodes: FileNode[],
  edges: DependencyEdge[]
): Record<number, number> {
  const adjacency = buildAdjacency(nodes, edges);
  const closure: Record<number, number> = {};

  for (const node of nodes) {
    const visited = new Set<number>();
    const stack = [node.id];
    let total = 0;

    while (stack.length > 0) {
      const current = stack.pop();
      if (current == null || visited.has(current)) {
        continue;
      }
      visited.add(current);
      total += nodes[current]?.sizeBytes ?? 0;
      for (const next of adjacency[current] ?? []) {
        if (!visited.has(next)) {
          stack.push(next);
        }
      }
    }

    closure[node.id] = total;
  }

  return closure;
}

export function buildAggregates(
  nodes: FileNode[],
  edges: DependencyEdge[],
  depth: number
): { nodes: AggregateNode[]; edges: AggregateEdge[]; depth: number } {
  const aggregateNodeMap = new Map<string, AggregateNode>();
  const edgeWeight = new Map<string, number>();

  const byNodeId = new Map<number, FileNode>();
  for (const node of nodes) {
    byNodeId.set(node.id, node);
    const key = aggregateKey(node.path, depth);
    const existing = aggregateNodeMap.get(key);
    if (existing) {
      existing.fileCount += 1;
      existing.sizeBytes += node.sizeBytes;
      continue;
    }
    aggregateNodeMap.set(key, {
      id: key,
      label: key,
      fileCount: 1,
      sizeBytes: node.sizeBytes
    });
  }

  for (const edge of edges) {
    if (edge.external || edge.to < 0) {
      continue;
    }
    const fromNode = byNodeId.get(edge.from);
    const toNode = byNodeId.get(edge.to);
    if (!fromNode || !toNode) {
      continue;
    }
    const fromKey = aggregateKey(fromNode.path, depth);
    const toKey = aggregateKey(toNode.path, depth);
    if (fromKey === toKey) {
      continue;
    }
    const edgeKey = `${fromKey}->${toKey}`;
    edgeWeight.set(edgeKey, (edgeWeight.get(edgeKey) ?? 0) + 1);
  }

  const aggregateEdges: AggregateEdge[] = [];
  for (const [key, weight] of edgeWeight) {
    const [from, to] = key.split("->");
    aggregateEdges.push({
      from: from ?? "",
      to: to ?? "",
      weight
    });
  }

  return {
    nodes: Array.from(aggregateNodeMap.values()).sort((a, b) => a.id.localeCompare(b.id)),
    edges: aggregateEdges.sort((a, b) => b.weight - a.weight),
    depth
  };
}

function hasSelfLoop(nodeId: number, adjacency: number[][]): boolean {
  return (adjacency[nodeId] ?? []).includes(nodeId);
}

function percentileValue(sortedValues: number[], percentile: number): number {
  if (sortedValues.length === 0) {
    return 0;
  }
  const index = Math.floor((percentile / 100) * (sortedValues.length - 1));
  return sortedValues[Math.max(0, Math.min(index, sortedValues.length - 1))] ?? 0;
}

function rankPercentile(sortedValues: number[], value: number): number {
  if (sortedValues.length === 0) {
    return 0;
  }
  let count = 0;
  for (const current of sortedValues) {
    if (current <= value) {
      count += 1;
    }
  }
  return (count / sortedValues.length) * 100;
}
