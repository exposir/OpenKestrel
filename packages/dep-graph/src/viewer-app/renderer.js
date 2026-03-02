/**
 * - [INPUT]: 依赖图节点/边数据、渲染容器与节点点击/空白点击回调
 * - [OUTPUT]: 提供 mountGraphRenderer/destroyGraphRenderer，封装 WebGL 优先与 SVG 回退渲染
 * - [POS]: viewer-app 渲染基础设施层，供 app.js 复用
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
 */

export async function mountGraphRenderer({ container, graphData, handlers, previousRenderer }) {
  destroyGraphRenderer(container, previousRenderer);

  const webglRenderer = await tryCreateWebglRenderer(container, graphData, handlers);
  if (webglRenderer) {
    return webglRenderer;
  }

  return renderSvgGraph(container, graphData, handlers);
}

export function destroyGraphRenderer(container, renderer) {
  if (renderer && typeof renderer.kill === "function") {
    renderer.kill();
  }
  container.innerHTML = "";
}

async function tryCreateWebglRenderer(container, graphData, handlers) {
  if (!isWebGlAvailable()) {
    return null;
  }

  try {
    const [{ default: Graph }, { default: Sigma }] = await Promise.all([
      import("https://esm.sh/graphology@0.26.0"),
      import("https://esm.sh/sigma@3.0.0-beta.6"),
    ]);

    const graph = new Graph();
    for (const node of graphData.nodes) {
      graph.addNode(node.id, {
        label: node.label,
        x: node.x,
        y: node.y,
        size: node.size,
        color: node.color,
      });
    }

    for (const edge of graphData.edges) {
      if (graph.hasNode(edge.from) && graph.hasNode(edge.to)) {
        graph.addEdge(edge.id, edge.from, edge.to, {
          size: edge.width,
          color: edge.color,
        });
      }
    }

    const sigma = new Sigma(graph, container, {
      renderLabels: true,
      labelDensity: 0.5,
      labelRenderedSizeThreshold: 2,
      zIndex: true,
      minCameraRatio: 0.08,
      maxCameraRatio: 5,
    });

    sigma.on("clickNode", ({ node }) => handlers.onNodeClick(node));
    sigma.on("clickStage", () => handlers.onBlankClick());

    return {
      kill: () => sigma.kill(),
    };
  } catch {
    return null;
  }
}

function renderSvgGraph(container, graphData, handlers) {
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
  const byId = new Map(projected.map((node) => [node.id, node]));
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
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", String(node.px));
    circle.setAttribute("cy", String(node.py));
    circle.setAttribute("r", String(Math.max(2, node.size)));
    circle.setAttribute("fill", node.color || "#2b7fff");
    circle.style.cursor = "pointer";

    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = node.label;

    circle.addEventListener("click", () => handlers.onNodeClick(node.id));
    group.appendChild(circle);
    group.appendChild(title);

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
      group.appendChild(label);
    }

    rootGroup.appendChild(group);
  }

  attachSvgPanZoom(svg, rootGroup, bgRect, handlers.onBlankClick);
  container.appendChild(svg);

  return {
    kill: () => {
      container.innerHTML = "";
    },
  };
}

function projectNodes(nodes, width, height) {
  if (nodes.length === 0) return [];
  const xs = nodes.map((node) => node.x);
  const ys = nodes.map((node) => node.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeX = Math.max(1, maxX - minX);
  const rangeY = Math.max(1, maxY - minY);
  const padding = 30;

  return nodes.map((node) => ({
    ...node,
    px: padding + ((node.x - minX) / rangeX) * (width - padding * 2),
    py: padding + ((node.y - minY) / rangeY) * (height - padding * 2),
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
    y2: to.py - uy * toPad,
  };
}

function shortenLabel(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}...`;
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
    baseTy: 0,
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

function isWebGlAvailable() {
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
}
