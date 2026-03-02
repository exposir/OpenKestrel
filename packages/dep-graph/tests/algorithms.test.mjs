/**
 * - [INPUT]: 依赖 dist/index.js 暴露的图算法 API
 * - [OUTPUT]: 验证 SCC/网状识别/闭包大小基础正确性
 * - [POS]: dep-graph 单测入口，提供核心算法回归保障
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
 */

import test from "node:test";
import assert from "node:assert/strict";

import { computeClosureSizes, findCycles, findMeshNodes } from "../dist/index.js";

const nodes = [
  { id: 0, path: "a.ts", ext: ".ts", sizeBytes: 100, inDegree: 1, outDegree: 1, meshScore: 0, externalRefsCount: 0 },
  { id: 1, path: "b.ts", ext: ".ts", sizeBytes: 200, inDegree: 1, outDegree: 2, meshScore: 0, externalRefsCount: 0 },
  { id: 2, path: "c.ts", ext: ".ts", sizeBytes: 300, inDegree: 1, outDegree: 0, meshScore: 0, externalRefsCount: 0 }
];

const edges = [
  { from: 0, to: 1, kind: "static", external: false },
  { from: 1, to: 0, kind: "static", external: false },
  { from: 1, to: 2, kind: "static", external: false }
];

test("findCycles detects SCC", () => {
  const cycles = findCycles(nodes, edges);
  assert.equal(cycles.length, 1);
  assert.deepEqual(cycles[0].nodeIds.sort(), [0, 1]);
});

test("computeClosureSizes sums deduplicated closure size", () => {
  const closure = computeClosureSizes(nodes, edges);
  assert.equal(closure[0], 600);
  assert.equal(closure[1], 600);
  assert.equal(closure[2], 300);
});

test("findMeshNodes returns fan-in/fan-out hotspots", () => {
  const mesh = findMeshNodes(nodes, 50);
  assert.ok(mesh.length >= 1);
  assert.equal(mesh[0].nodeId, 1);
});
