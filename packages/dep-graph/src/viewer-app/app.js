/**
 * - [INPUT]: 依赖 /api/report 返回的 AnalysisReport 数据
 * - [OUTPUT]: 提供聚合图与文件子图渲染、搜索与详情交互
 * - [POS]: viewer-app 交互层，优先 WebGL，失败时自动降级 SVG
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
 */

let report = null;
let renderer = null;
let lastGraphData = null;
let selectedNodeId = null;
let currentView = null;
const viewStack = [];
const clickMemory = {
  key: "",
  at: 0
};
const DOUBLE_CLICK_MS = 280;

const container = document.getElementById("graph-container");
const meta = document.getElementById("meta");
const details = document.getElementById("details");
const search = document.getElementById("search");
const searchResults = document.getElementById("search-results");
const meshList = document.getElementById("mesh-list");
const cycleList = document.getElementById("cycle-list");
const aggregateBtn = document.getElementById("show-aggregate");
const fileBtn = document.getElementById("show-file");
const shortNameToggle = document.getElementById("toggle-short-name");
const directionSelect = document.getElementById("filter-direction");
const depthSelect = document.getElementById("filter-depth");
const edgeLimitToggle = document.getElementById("toggle-edge-limit");
const edgeLimitInput = document.getElementById("edge-limit-input");
const cycleOnlyToggle = document.getElementById("toggle-cycle-only");
const filterSummary = document.getElementById("filter-summary");
const performanceWarning = document.getElementById("performance-warning");

const uiState = {
  shortNameOnly: false,
  filters: {
    direction: "both",
    depth: 1,
    edgeLimitEnabled: true,
    edgeLimit: 1200,
    cycleOnly: false
  }
};

void bootstrap();

async function bootstrap() {
  report = await fetchReport();
  meta.textContent = `${report.meta.fileCount} files | ${report.meta.edgeCount} edges | duration ${report.meta.durationMs}ms`;

  bindFilterEvents();
  initSidePanels();
  initSearch();
  goToView({ type: "aggregate" }, false);
  details.textContent = "提示: 箭头方向为 from -> to，点击左侧结果或图中节点可查看依赖详情。";

  aggregateBtn?.addEventListener("click", () => {
    viewStack.length = 0;
    goToView({ type: "aggregate" }, false);
  });

  fileBtn?.addEventListener("click", () => {
    const centerNodeId = selectedNodeId ?? report.mesh[0]?.nodeId ?? 0;
    viewStack.length = 0;
    goToView({ type: "file", centerNodeId }, false);
  });
}

function bindFilterEvents() {
  shortNameToggle?.addEventListener("change", () => {
    uiState.shortNameOnly = Boolean(shortNameToggle.checked);
    initSidePanels();
    if (search.value.trim()) {
      search.dispatchEvent(new Event("input"));
    }
    rerenderCurrentView();
  });

  directionSelect?.addEventListener("change", () => {
    const value = String(directionSelect.value);
    if (value === "both" || value === "outbound" || value === "inbound") {
      uiState.filters.direction = value;
    }
    rerenderCurrentView();
  });

  depthSelect?.addEventListener("change", () => {
    const value = Number(depthSelect.value);
    uiState.filters.depth = value === 1 || value === 2 || value === 3 ? value : 1;
    rerenderCurrentView();
  });

  edgeLimitToggle?.addEventListener("change", () => {
    uiState.filters.edgeLimitEnabled = Boolean(edgeLimitToggle.checked);
    rerenderCurrentView();
  });

  edgeLimitInput?.addEventListener("change", () => {
    const value = Number(edgeLimitInput.value);
    uiState.filters.edgeLimit = Number.isFinite(value) ? Math.max(100, Math.floor(value)) : 1200;
    edgeLimitInput.value = String(uiState.filters.edgeLimit);
    rerenderCurrentView();
  });

  cycleOnlyToggle?.addEventListener("change", () => {
    uiState.filters.cycleOnly = Boolean(cycleOnlyToggle.checked);
    rerenderCurrentView();
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
  if (report.mesh.length > 0) {
    for (const item of report.mesh.slice(0, 20)) {
      const node = report.nodes[item.nodeId];
      if (!node) continue;
      const el = createResultItem(
        `${formatNodeName(node)}\nscore=${item.score.toFixed(3)} in=${item.inDegree} out=${item.outDegree}`,
        () => {
          selectedNodeId = item.nodeId;
          goToView({ type: "file", centerNodeId: item.nodeId });
          writeNodeDetails(item.nodeId);
        }
      );
      meshList.appendChild(el);
    }
  } else {
    const fallback = report.nodes
      .slice()
      .sort((a, b) => b.outDegree + b.inDegree - (a.outDegree + a.inDegree))
      .slice(0, 20);

    if (fallback.length === 0) {
      meshList.appendChild(createResultItem("暂无可展示文件", () => {}));
    } else {
      for (const node of fallback) {
        const el = createResultItem(
          `${formatNodeName(node)}\nin=${node.inDegree} out=${node.outDegree}`,
          () => {
            selectedNodeId = node.id;
            goToView({ type: "file", centerNodeId: node.id });
            writeNodeDetails(node.id);
          }
        );
        meshList.appendChild(el);
      }
    }
  }

  cycleList.innerHTML = "";
  if (report.cycles.length > 0) {
    for (const cycle of report.cycles.slice(0, 20)) {
      const first = cycle.nodeIds[0];
      const node = report.nodes[first];
      const label = node ? formatNodeName(node) : String(first);
      const el = createResultItem(`cycle#${cycle.id} size=${cycle.size}\n${label}`, () => {
        if (first != null) {
          selectedNodeId = first;
          goToView({ type: "file", centerNodeId: first });
          writeNodeDetails(first);
        }
      });
      cycleList.appendChild(el);
    }
  } else {
    cycleList.appendChild(createResultItem("未检测到循环依赖", () => {}));
  }
}

function initSearch() {
  renderSearchResults("");
  search.addEventListener("input", () => {
    const keyword = String(search.value || "").trim().toLowerCase();
    renderSearchResults(keyword);
  });
}

function renderSearchResults(keyword) {
  const source = keyword
    ? report.nodes.filter((node) => node.path.toLowerCase().includes(keyword))
    : report.nodes.slice().sort((a, b) => b.sizeBytes - a.sizeBytes);
  const hits = source.slice(0, keyword ? 80 : 12);

  searchResults.innerHTML = "";
  for (const node of hits) {
    const el = createResultItem(`${formatNodeName(node)}`, () => {
      selectedNodeId = node.id;
      goToView({ type: "file", centerNodeId: node.id });
      writeNodeDetails(node.id);
    });
    searchResults.appendChild(el);
  }
}

function renderAggregateGraph() {
  const graphData = {
    nodes: [],
    edges: []
  };

  const nodes = report.aggregates.nodes;
  const edges = report.aggregates.edges;
  const angleStep = (Math.PI * 2) / Math.max(1, nodes.length);

  nodes.forEach((node, index) => {
    const angle = index * angleStep;
    graphData.nodes.push({
      id: node.id,
      label: `${node.label} (${node.fileCount})`,
      x: Math.cos(angle) * 10,
      y: Math.sin(angle) * 10,
      size: Math.max(4, Math.min(18, 4 + Math.log10(node.fileCount + 1) * 5)),
      color: "#0a7cff"
    });
  });

  edges.slice(0, 3000).forEach((edge, index) => {
    graphData.edges.push({
      id: `${edge.from}->${edge.to}-${index}`,
      from: edge.from,
      to: edge.to,
      color: "#a5b4d6",
      width: Math.max(0.3, Math.min(3, edge.weight / 3))
    });
  });

  updateFilterSummary({
    nodes: graphData.nodes,
    edges: graphData.edges,
    rawEdgeCount: graphData.edges.length,
    hiddenEdgeCount: 0
  });

  void mountRenderer(graphData, {
    onNodeClick: (nodeKey) => handleNodeInteraction(nodeKey),
    onBlankClick: () => goBackView()
  });

  details.textContent = `当前视图: 聚合图 (depth=${report.aggregates.depth})`;
}

function renderFocusedFileGraph(centerNodeId, prefix) {
  const graphData = buildFileGraphData({
    centerNodeId,
    prefix,
    filters: uiState.filters
  });

  updateFilterSummary(graphData);

  void mountRenderer(graphData, {
    onNodeClick: (nodeKey) => handleNodeInteraction(nodeKey),
    onBlankClick: () => goBackView()
  });

  details.textContent = `当前视图: 文件子图 | 节点 ${graphData.nodes.length} | 边 ${graphData.edges.length}`;
}

function buildFileGraphData({ centerNodeId, prefix, filters }) {
  const cycleNodeSet = new Set();
  for (const cycle of report.cycles) {
    for (const id of cycle.nodeIds) {
      cycleNodeSet.add(id);
    }
  }

  const adjacencyOut = new Map();
  const adjacencyIn = new Map();
  const baseEdges = [];

  for (const edge of report.edges) {
    if (edge.external || edge.to < 0) continue;
    if (filters.cycleOnly && (!cycleNodeSet.has(edge.from) || !cycleNodeSet.has(edge.to))) {
      continue;
    }

    baseEdges.push(edge);
    if (!adjacencyOut.has(edge.from)) adjacencyOut.set(edge.from, []);
    if (!adjacencyIn.has(edge.to)) adjacencyIn.set(edge.to, []);
    adjacencyOut.get(edge.from).push(edge.to);
    adjacencyIn.get(edge.to).push(edge.from);
  }

  let candidateIds = [];
  if (prefix) {
    candidateIds = report.nodes
      .filter((node) => node.path.startsWith(prefix) && (!filters.cycleOnly || cycleNodeSet.has(node.id)))
      .map((node) => node.id);
  } else {
    candidateIds = collectNeighborSubgraph(
      centerNodeId,
      adjacencyOut,
      adjacencyIn,
      filters.depth,
      1200,
      filters.direction
    );
  }

  const candidateSet = new Set(candidateIds);
  const graphData = {
    nodes: [],
    edges: [],
    rawEdgeCount: 0,
    hiddenEdgeCount: 0
  };

  const angleStep = (Math.PI * 2) / Math.max(1, candidateIds.length);
  candidateIds.forEach((id, index) => {
    const node = report.nodes[id];
    if (!node) return;
    const angle = index * angleStep;
    graphData.nodes.push({
      id: String(id),
      label: formatNodeName(node),
      x: Math.cos(angle) * (8 + index / 30),
      y: Math.sin(angle) * (8 + index / 30),
      size: Math.max(2, Math.min(14, 2 + Math.log10(node.sizeBytes + 10))),
      color: (node.meshScore || 0) > 0.4 ? "#ff5c5c" : "#2b7fff"
    });
  });

  let edgeCount = 0;
  for (const edge of baseEdges) {
    if (!candidateSet.has(edge.from) || !candidateSet.has(edge.to)) continue;
    if (filters.direction === "outbound" && edge.from !== centerNodeId) continue;
    if (filters.direction === "inbound" && edge.to !== centerNodeId) continue;

    graphData.rawEdgeCount += 1;

    if (filters.edgeLimitEnabled && edgeCount >= filters.edgeLimit) {
      graphData.hiddenEdgeCount += 1;
      continue;
    }

    graphData.edges.push({
      id: `${edge.from}-${edge.to}-${edgeCount}`,
      from: String(edge.from),
      to: String(edge.to),
      color: "#9eb0d8",
      width: 0.7
    });
    edgeCount += 1;
  }

  return graphData;
}

function updateFilterSummary(graphData) {
  if (filterSummary) {
    filterSummary.textContent =
      `方向: ${formatDirection(uiState.filters.direction)} | 深度: ${uiState.filters.depth}跳 | ` +
      `环路: ${uiState.filters.cycleOnly ? "仅环路" : "全部"} | ` +
      `边: ${graphData.edges.length}/${graphData.rawEdgeCount}` +
      (uiState.filters.edgeLimitEnabled ? ` (限流 ${uiState.filters.edgeLimit})` : " (不限流)");
  }

  if (!performanceWarning) {
    return;
  }

  if (!uiState.filters.edgeLimitEnabled && graphData.rawEdgeCount > 2000) {
    performanceWarning.hidden = false;
    performanceWarning.textContent = "当前为全量边显示，图可能变得拥挤且性能下降。建议开启边限流或缩小方向/深度。";
    return;
  }

  if (graphData.nodes.length === 0 || graphData.edges.length === 0) {
    performanceWarning.hidden = false;
    performanceWarning.textContent = "当前筛选无结果，请放宽方向/深度/环路条件。";
    return;
  }

  if (graphData.hiddenEdgeCount > 0 && uiState.filters.edgeLimitEnabled) {
    performanceWarning.hidden = false;
    performanceWarning.textContent = `已隐藏 ${graphData.hiddenEdgeCount} 条边以保证可读性。`;
    return;
  }

  performanceWarning.hidden = true;
}

function formatDirection(direction) {
  if (direction === "outbound") return "下游";
  if (direction === "inbound") return "上游";
  return "双向";
}

async function mountRenderer(graphData, handlers) {
  lastGraphData = graphData;
  destroyRenderer();

  const webglRenderer = await tryCreateWebglRenderer(graphData, handlers);
  if (webglRenderer) {
    renderer = webglRenderer;
    return;
  }

  renderSvgGraph(graphData, handlers);
}

async function tryCreateWebglRenderer(graphData, handlers) {
  if (!isWebGlAvailable()) {
    return null;
  }

  try {
    const [{ default: Graph }, { default: Sigma }] = await Promise.all([
      import("https://esm.sh/graphology@0.26.0"),
      import("https://esm.sh/sigma@3.0.0-beta.6")
    ]);

    const graph = new Graph();
    for (const node of graphData.nodes) {
      graph.addNode(node.id, {
        label: node.label,
        x: node.x,
        y: node.y,
        size: node.size,
        color: node.color
      });
    }

    for (const edge of graphData.edges) {
      if (graph.hasNode(edge.from) && graph.hasNode(edge.to)) {
        graph.addEdge(edge.id, edge.from, edge.to, {
          size: edge.width,
          color: edge.color
        });
      }
    }

    const sigma = new Sigma(graph, container, {
      renderLabels: true,
      labelDensity: 0.5,
      labelRenderedSizeThreshold: 2,
      zIndex: true,
      minCameraRatio: 0.08,
      maxCameraRatio: 5
    });

    sigma.on("clickNode", ({ node }) => handlers.onNodeClick(node));
    sigma.on("clickStage", () => handlers.onBlankClick());

    return {
      kill: () => sigma.kill()
    };
  } catch {
    return null;
  }
}

function renderSvgGraph(graphData, handlers) {
  container.innerHTML = "";
  const width = Math.max(600, container.clientWidth || 600);
  const height = Math.max(400, container.clientHeight || 400);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.background = "#f8fbff";

  const rootGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  rootGroup.setAttribute("transform", "translate(0 0) scale(1)");
  svg.appendChild(rootGroup);

  const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bgRect.setAttribute("x", "0");
  bgRect.setAttribute("y", "0");
  bgRect.setAttribute("width", String(width));
  bgRect.setAttribute("height", String(height));
  bgRect.setAttribute("fill", "transparent");
  rootGroup.appendChild(bgRect);

  const projected = projectNodes(graphData.nodes, width, height);
  const byId = new Map(projected.map((n) => [n.id, n]));
  const markerId = `arrow-${Date.now()}`;

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  marker.setAttribute("id", markerId);
  marker.setAttribute("viewBox", "0 0 10 10");
  marker.setAttribute("refX", "9");
  marker.setAttribute("refY", "5");
  marker.setAttribute("markerWidth", "7");
  marker.setAttribute("markerHeight", "7");
  marker.setAttribute("orient", "auto-start-reverse");
  const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  markerPath.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
  markerPath.setAttribute("fill", "#90a6d6");
  marker.appendChild(markerPath);
  defs.appendChild(marker);
  rootGroup.appendChild(defs);

  for (const edge of graphData.edges) {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    if (!from || !to) continue;
    const adjusted = adjustLineEndpoints(from, to);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(adjusted.x1));
    line.setAttribute("y1", String(adjusted.y1));
    line.setAttribute("x2", String(adjusted.x2));
    line.setAttribute("y2", String(adjusted.y2));
    line.setAttribute("stroke", edge.color || "#a5b4d6");
    line.setAttribute("stroke-width", String(Math.max(0.7, edge.width || 0.7)));
    line.setAttribute("stroke-opacity", "0.7");
    line.setAttribute("marker-end", `url(#${markerId})`);
    rootGroup.appendChild(line);
  }

  for (const node of projected) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", String(node.px));
    c.setAttribute("cy", String(node.py));
    c.setAttribute("r", String(Math.max(2, node.size)));
    c.setAttribute("fill", node.color || "#2b7fff");
    c.style.cursor = "pointer";

    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = node.label;

    c.addEventListener("click", () => handlers.onNodeClick(node.id));
    g.appendChild(c);
    g.appendChild(title);

    if (projected.length <= 120) {
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", String(node.px + 8));
      label.setAttribute("y", String(node.py - 8));
      label.setAttribute("font-size", "11");
      label.setAttribute("fill", "#1b2b4b");
      label.setAttribute("paint-order", "stroke");
      label.setAttribute("stroke", "#ffffff");
      label.setAttribute("stroke-width", "3");
      label.textContent = shortenLabel(node.label, 42);
      g.appendChild(label);
    }

    rootGroup.appendChild(g);
  }

  attachSvgPanZoom(svg, rootGroup, bgRect, handlers.onBlankClick);
  container.appendChild(svg);
  renderer = {
    kill: () => {
      container.innerHTML = "";
    }
  };
}

function projectNodes(nodes, width, height) {
  if (nodes.length === 0) return [];
  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeX = Math.max(1, maxX - minX);
  const rangeY = Math.max(1, maxY - minY);
  const padding = 30;

  return nodes.map((n) => ({
    ...n,
    px: padding + ((n.x - minX) / rangeX) * (width - padding * 2),
    py: padding + ((n.y - minY) / rangeY) * (height - padding * 2)
  }));
}

function adjustLineEndpoints(from, to) {
  const dx = to.px - from.px;
  const dy = to.py - from.py;
  const len = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / len;
  const uy = dy / len;
  const fromPad = Math.max(3, from.size + 1);
  const toPad = Math.max(6, to.size + 5);
  return {
    x1: from.px + ux * fromPad,
    y1: from.py + uy * fromPad,
    x2: to.px - ux * toPad,
    y2: to.py - uy * toPad
  };
}

function shortenLabel(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function attachSvgPanZoom(svg, rootGroup, bgRect, onBlankClick) {
  const state = {
    scale: 1,
    tx: 0,
    ty: 0,
    dragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    baseTx: 0,
    baseTy: 0
  };

  const applyTransform = () => {
    rootGroup.setAttribute("transform", `translate(${state.tx} ${state.ty}) scale(${state.scale})`);
  };

  const onDown = (event) => {
    if (event.button !== 0) return;
    state.dragging = true;
    state.moved = false;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.baseTx = state.tx;
    state.baseTy = state.ty;
  };

  const onMove = (event) => {
    if (!state.dragging) return;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      state.moved = true;
    }
    state.tx = state.baseTx + dx;
    state.ty = state.baseTy + dy;
    applyTransform();
  };

  const onUp = (event) => {
    if (!state.dragging) return;
    state.dragging = false;
    if (!state.moved && event.target === bgRect) {
      onBlankClick();
    }
  };

  const onWheel = (event) => {
    event.preventDefault();
    const zoom = event.deltaY < 0 ? 1.08 : 0.92;
    const next = Math.max(0.3, Math.min(5, state.scale * zoom));
    if (next === state.scale) return;
    state.scale = next;
    applyTransform();
  };

  bgRect.addEventListener("mousedown", onDown);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  svg.addEventListener("wheel", onWheel, { passive: false });
}

function destroyRenderer() {
  if (renderer && typeof renderer.kill === "function") {
    renderer.kill();
  }
  renderer = null;
  container.innerHTML = "";
}

function writeNodeDetails(nodeId) {
  const node = report.nodes[nodeId];
  if (!node) return;

  const out = [];
  const inbound = [];
  for (const edge of report.edges) {
    if (edge.external || edge.to < 0) continue;
    if (edge.from === nodeId) {
      const outNode = report.nodes[edge.to];
      out.push(outNode ? formatNodeName(outNode) : String(edge.to));
    }
    if (edge.to === nodeId) {
      const inNode = report.nodes[edge.from];
      inbound.push(inNode ? formatNodeName(inNode) : String(edge.from));
    }
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

function collectNeighborSubgraph(startId, adjacencyOut, adjacencyIn, depth, maxNodes, direction) {
  const visited = new Set();
  const queue = [{ id: startId, level: 0 }];

  while (queue.length > 0 && visited.size < maxNodes) {
    const item = queue.shift();
    if (!item || visited.has(item.id)) continue;
    visited.add(item.id);
    if (item.level >= depth) continue;

    if (direction === "both" || direction === "outbound") {
      for (const next of adjacencyOut.get(item.id) || []) {
        if (!visited.has(next)) queue.push({ id: next, level: item.level + 1 });
      }
    }
    if (direction === "both" || direction === "inbound") {
      for (const prev of adjacencyIn.get(item.id) || []) {
        if (!visited.has(prev)) queue.push({ id: prev, level: item.level + 1 });
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

function formatNodeName(node) {
  const name = uiState.shortNameOnly ? getLeafName(node.path) : node.path;
  return `${name} (${formatSize(node.sizeBytes)})`;
}

function getLeafName(filePath) {
  const parts = String(filePath).split("/");
  return parts[parts.length - 1] || filePath;
}

function goToView(view, pushHistory = true) {
  if (pushHistory && currentView) {
    viewStack.push(currentView);
  }
  currentView = view;

  if (view.type === "aggregate") {
    renderAggregateGraph();
    return;
  }

  renderFocusedFileGraph(view.centerNodeId, view.prefix);
}

function rerenderCurrentView() {
  if (!currentView) {
    return;
  }
  goToView(currentView, false);
}

function goBackView() {
  if (viewStack.length === 0) {
    return;
  }
  const previous = viewStack.pop();
  if (!previous) {
    return;
  }
  goToView(previous, false);
}

function handleNodeInteraction(nodeKey) {
  const normalizedKey = String(nodeKey);
  const now = Date.now();
  const isDouble = clickMemory.key === normalizedKey && now - clickMemory.at <= DOUBLE_CLICK_MS;
  clickMemory.key = normalizedKey;
  clickMemory.at = now;

  if (currentView?.type === "aggregate") {
    const prefix = normalizedKey;
    const target = report.nodes.find((node) => node.path.startsWith(prefix));
    if (target) {
      selectedNodeId = target.id;
      writeNodeDetails(target.id);
      if (isDouble) {
        goToView({ type: "file", centerNodeId: target.id, prefix });
      }
    }
    return;
  }

  const id = Number(normalizedKey);
  if (Number.isFinite(id)) {
    selectedNodeId = id;
    writeNodeDetails(id);
    if (isDouble) {
      goToView({ type: "file", centerNodeId: id });
    }
  }
}
