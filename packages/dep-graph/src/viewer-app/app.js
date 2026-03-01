/**
 * - [INPUT]: 依赖 /api/report 返回的 AnalysisReport 与 sigma/graphology
 * - [OUTPUT]: 提供聚合图与文件子图渲染、搜索与详情交互
 * - [POS]: viewer-app 交互层，负责 WebGL 渲染与按需展开
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
 */

import Graph from "https://esm.sh/graphology@0.26.0";
import Sigma from "https://esm.sh/sigma@3.0.0-beta.6";

let report = null;
let renderer = null;
let currentMode = "aggregate";
let selectedNodeId = null;

const container = document.getElementById("graph-container");
const meta = document.getElementById("meta");
const details = document.getElementById("details");
const search = document.getElementById("search");
const searchResults = document.getElementById("search-results");
const meshList = document.getElementById("mesh-list");
const cycleList = document.getElementById("cycle-list");
const aggregateBtn = document.getElementById("show-aggregate");
const fileBtn = document.getElementById("show-file");

void bootstrap();

async function bootstrap() {
  report = await fetchReport();
  meta.textContent = `${report.meta.fileCount} files | ${report.meta.edgeCount} edges | duration ${report.meta.durationMs}ms`;

  initSidePanels();
  initSearch();

  if (!isWebGlAvailable()) {
    details.textContent = "当前环境不支持 WebGL，已降级为列表浏览模式。";
    return;
  }

  renderAggregateGraph();

  aggregateBtn.addEventListener("click", () => {
    currentMode = "aggregate";
    renderAggregateGraph();
  });

  fileBtn.addEventListener("click", () => {
    currentMode = "file";
    renderFocusedFileGraph(selectedNodeId ?? report.mesh[0]?.nodeId ?? 0);
  });
}

async function fetchReport() {
  const response = await fetch("/api/report");
  if (!response.ok) {
    throw new Error("failed to fetch report");
  }
  return response.json();
}

function initSidePanels() {
  meshList.innerHTML = "";
  for (const item of report.mesh.slice(0, 20)) {
    const node = report.nodes[item.nodeId];
    if (!node) continue;
    const el = createResultItem(
      `${node.path}\nscore=${item.score.toFixed(3)} in=${item.inDegree} out=${item.outDegree}`,
      () => {
        selectedNodeId = item.nodeId;
        renderFocusedFileGraph(item.nodeId);
        writeNodeDetails(item.nodeId);
      }
    );
    meshList.appendChild(el);
  }

  cycleList.innerHTML = "";
  for (const cycle of report.cycles.slice(0, 20)) {
    const first = cycle.nodeIds[0];
    const node = report.nodes[first];
    const label = node ? node.path : String(first);
    const el = createResultItem(`cycle#${cycle.id} size=${cycle.size}\n${label}`, () => {
      if (first != null) {
        selectedNodeId = first;
        renderFocusedFileGraph(first);
        writeNodeDetails(first);
      }
    });
    cycleList.appendChild(el);
  }
}

function initSearch() {
  search.addEventListener("input", () => {
    const keyword = String(search.value || "").trim().toLowerCase();
    if (!keyword) {
      searchResults.innerHTML = "";
      return;
    }

    const hits = report.nodes
      .filter((node) => node.path.toLowerCase().includes(keyword))
      .slice(0, 80);

    searchResults.innerHTML = "";
    for (const node of hits) {
      const el = createResultItem(`${node.path}\n${formatSize(node.sizeBytes)}`, () => {
        selectedNodeId = node.id;
        currentMode = "file";
        renderFocusedFileGraph(node.id);
        writeNodeDetails(node.id);
      });
      searchResults.appendChild(el);
    }
  });
}

function renderAggregateGraph() {
  const graph = new Graph();
  const nodes = report.aggregates.nodes;
  const edges = report.aggregates.edges;

  const angleStep = (Math.PI * 2) / Math.max(1, nodes.length);
  nodes.forEach((node, index) => {
    const angle = index * angleStep;
    graph.addNode(node.id, {
      label: `${node.label} (${node.fileCount})`,
      x: Math.cos(angle) * 10,
      y: Math.sin(angle) * 10,
      size: Math.max(4, Math.min(18, 4 + Math.log10(node.fileCount + 1) * 5)),
      color: "#0a7cff"
    });
  });

  edges.slice(0, 3000).forEach((edge, index) => {
    if (!graph.hasNode(edge.from) || !graph.hasNode(edge.to)) {
      return;
    }
    graph.addEdge(`${edge.from}->${edge.to}-${index}`, edge.from, edge.to, {
      size: Math.max(0.3, Math.min(3, edge.weight / 3)),
      color: "#a5b4d6"
    });
  });

  mountRenderer(graph, (nodeKey) => {
    const prefix = String(nodeKey);
    const target = report.nodes.find((node) => node.path.startsWith(prefix));
    if (target) {
      selectedNodeId = target.id;
      currentMode = "file";
      renderFocusedFileGraph(target.id, prefix);
      writeNodeDetails(target.id);
    }
  });

  details.textContent = `当前视图: 聚合图 (depth=${report.aggregates.depth})`;
}

function renderFocusedFileGraph(centerNodeId, prefix) {
  const graph = new Graph();
  const adjacencyOut = new Map();
  const adjacencyIn = new Map();

  for (const edge of report.edges) {
    if (edge.external || edge.to < 0) {
      continue;
    }
    if (!adjacencyOut.has(edge.from)) adjacencyOut.set(edge.from, []);
    if (!adjacencyIn.has(edge.to)) adjacencyIn.set(edge.to, []);
    adjacencyOut.get(edge.from).push(edge.to);
    adjacencyIn.get(edge.to).push(edge.from);
  }

  let candidateIds = [];
  if (prefix) {
    candidateIds = report.nodes.filter((node) => node.path.startsWith(prefix)).map((node) => node.id);
  } else {
    candidateIds = collectNeighborSubgraph(centerNodeId, adjacencyOut, adjacencyIn, 2, 500);
  }

  const candidateSet = new Set(candidateIds);
  const angleStep = (Math.PI * 2) / Math.max(1, candidateIds.length);
  candidateIds.forEach((id, idx) => {
    const node = report.nodes[id];
    if (!node) return;
    const angle = idx * angleStep;
    const score = node.meshScore || 0;
    graph.addNode(String(id), {
      label: node.path,
      x: Math.cos(angle) * (8 + idx / 30),
      y: Math.sin(angle) * (8 + idx / 30),
      size: Math.max(2, Math.min(14, 2 + Math.log10(node.sizeBytes + 10))),
      color: score > 0.4 ? "#ff5c5c" : "#2b7fff"
    });
  });

  let edgeCount = 0;
  for (const edge of report.edges) {
    if (edge.external || edge.to < 0) continue;
    if (!candidateSet.has(edge.from) || !candidateSet.has(edge.to)) continue;
    const from = String(edge.from);
    const to = String(edge.to);
    if (!graph.hasNode(from) || !graph.hasNode(to)) continue;
    graph.addEdge(`${from}-${to}-${edgeCount++}`, from, to, {
      size: 0.7,
      color: "#9eb0d8"
    });
    if (edgeCount > 3000) break;
  }

  mountRenderer(graph, (nodeKey) => {
    const id = Number(nodeKey);
    if (Number.isFinite(id)) {
      selectedNodeId = id;
      writeNodeDetails(id);
    }
  });

  details.textContent = `当前视图: 文件子图 | 节点 ${graph.order} | 边 ${graph.size}`;
}

function mountRenderer(graph, onClickNode) {
  if (renderer) {
    renderer.kill();
    renderer = null;
  }
  renderer = new Sigma(graph, container, {
    renderLabels: false,
    labelDensity: 0.06,
    zIndex: true,
    minCameraRatio: 0.08,
    maxCameraRatio: 5
  });

  renderer.on("clickNode", ({ node }) => {
    onClickNode(node);
  });
}

function writeNodeDetails(nodeId) {
  const node = report.nodes[nodeId];
  if (!node) {
    return;
  }

  const out = [];
  const inbound = [];

  for (const edge of report.edges) {
    if (edge.external || edge.to < 0) continue;
    if (edge.from === nodeId) out.push(report.nodes[edge.to]?.path || String(edge.to));
    if (edge.to === nodeId) inbound.push(report.nodes[edge.from]?.path || String(edge.from));
  }

  const cycle = report.cycles.find((item) => item.nodeIds.includes(nodeId));

  details.textContent = [
    `path: ${node.path}`,
    `size: ${formatSize(node.sizeBytes)} (${node.sizeBytes} bytes)`,
    `closure: ${formatSize(report.closureSizeByNode[nodeId] || 0)} (${report.closureSizeByNode[nodeId] || 0} bytes)`,
    `in/out: ${node.inDegree}/${node.outDegree}`,
    `meshScore: ${node.meshScore.toFixed(4)}`,
    `cycle: ${cycle ? `yes (#${cycle.id}, size=${cycle.size})` : "no"}`,
    "",
    `direct dependencies (${out.length}):`,
    ...out.slice(0, 40).map((item) => `- ${item}`),
    out.length > 40 ? `... +${out.length - 40}` : "",
    "",
    `reverse dependencies (${inbound.length}):`,
    ...inbound.slice(0, 40).map((item) => `- ${item}`),
    inbound.length > 40 ? `... +${inbound.length - 40}` : ""
  ].join("\n");
}

function collectNeighborSubgraph(startId, adjacencyOut, adjacencyIn, depth, maxNodes) {
  const visited = new Set();
  const queue = [{ id: startId, level: 0 }];

  while (queue.length > 0 && visited.size < maxNodes) {
    const item = queue.shift();
    if (!item || visited.has(item.id)) {
      continue;
    }
    visited.add(item.id);
    if (item.level >= depth) {
      continue;
    }
    for (const next of adjacencyOut.get(item.id) || []) {
      if (!visited.has(next)) {
        queue.push({ id: next, level: item.level + 1 });
      }
    }
    for (const prev of adjacencyIn.get(item.id) || []) {
      if (!visited.has(prev)) {
        queue.push({ id: prev, level: item.level + 1 });
      }
    }
  }

  return Array.from(visited);
}

function createResultItem(text, onClick) {
  const div = document.createElement("div");
  div.className = "result-item";
  div.textContent = text;
  div.addEventListener("click", onClick);
  return div;
}

function isWebGlAvailable() {
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
