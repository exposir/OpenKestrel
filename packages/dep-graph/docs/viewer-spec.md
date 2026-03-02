<!--
- [INPUT]: 依赖 dep-graph viewer 当前交互与筛选实现
- [OUTPUT]: 提供 viewer 行为规范与验收基线
- [POS]: dep-graph 可视化交互规范文档
- [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
-->

# Dep Graph Viewer 规范

## 1. 目标

在超大依赖图场景下，保证可读性、可定位性与操作一致性，避免“毛线球”不可读。

## 2. 视图模式

- 聚合图: 按目录层级展示（报告内 `aggregates` 数据）。
- 文件图: 以当前节点为中心生成子图，支持方向、深度、环路与限流筛选。

## 3. 筛选状态（GraphFilterState）

- `direction`: `both | outbound | inbound`
- `depth`: `1 | 2 | 3`
- `edgeLimitEnabled`: `boolean`
- `edgeLimit`: `number`（默认 `1200`）
- `cycleOnly`: `boolean`

默认值：

- `direction=both`
- `depth=1`
- `edgeLimitEnabled=true`
- `edgeLimit=1200`
- `cycleOnly=false`

## 4. 交互规范

- 节点单击: 更新右侧详情。
- 节点双击: 进入下一层文件图。
- 画布空白单击: 返回上一层视图。
- 画布拖动: 平移。
- 鼠标滚轮: 缩放。

## 5. 可读性保护

- 文件图默认 1 跳邻域。
- 边默认限流，超限时显示“已隐藏 N 条边”提示。
- 关闭限流且边数过高时，显示性能风险提示。
- 筛选无结果时，显示“请放宽筛选条件”提示。

## 6. 文本镜像面板（右侧）

右侧必须反映当前图内容，而非仅显示单节点：

- 图概览（节点/边/限流状态）
- 中心节点信息
- 下游依赖（图内）
- 上游引用（图内）
- 图内出度 Top
- 图内入度 Top

列表项可点击并跳转为新中心节点。

## 7. 标签与断行规则

- 文件名称展示格式: `path_or_leaf_name (size)`。
- 当“仅文件名”开关开启，显示叶子文件名。
- 所有列表与右侧文本块必须支持强制断行：
  - `white-space: pre-wrap`
  - `overflow-wrap: anywhere`
  - `word-break: break-word`

## 8. 渲染一致性

WebGL 与 SVG 降级模式必须共享同一份筛选后 `graphData`，确保两种渲染在同筛选下节点/边数量一致。

## 9. 验收基线

- 同一中心节点下：`outbound`/`inbound` 边数应不超过 `both`。
- `depth=1` 节点规模应明显小于 `depth=2/3`。
- `cycleOnly=true` 时，图中节点均属于循环依赖集合。
- `edgeLimitEnabled=true` 且 `edgeLimit=1200` 时，实际渲染边数不超过 1200。
