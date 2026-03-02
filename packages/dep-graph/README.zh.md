<!--
- [INPUT]: 依赖 dep-graph 包的 CLI/SDK 导出能力
- [OUTPUT]: 提供 dep-graph 的中文安装与使用说明
- [POS]: dep-graph 对外中文文档入口
- [PROTOCOL]: 变更时更新此头部，然后检查 ./CLAUDE.md
-->

# @openkestrel/dep-graph

面向 TS/JS 项目的高性能依赖图分析工具包。

## 功能

- 检测文件级循环依赖（SCC）。
- 识别网状依赖热点（高 fan-in + 高 fan-out）。
- 计算文件体积与去重后的依赖闭包体积。
- 启动本地 WebGL viewer，查看聚合图与指定文件子图。
- 按文件路径搜索节点。

## 使用

```bash
pnpm --filter @openkestrel/dep-graph build
pnpm --filter @openkestrel/dep-graph okdep analyze . --open
```

仅分析并输出报告：

```bash
pnpm --filter @openkestrel/dep-graph okdep analyze . --out .okdep/report.json
```

从已有报告启动 viewer：

```bash
pnpm --filter @openkestrel/dep-graph okdep web --report .okdep/report.json --port 4711
```

打印循环依赖：

```bash
pnpm --filter @openkestrel/dep-graph okdep print-cycles .
```

打印网状热点：

```bash
pnpm --filter @openkestrel/dep-graph okdep print-mesh .
```

## 说明

- 建议在源码目录运行。
- 对构建产物运行也可用，但结果仅反映产物依赖图。

## 规格

- Viewer 行为与筛选规格：[`docs/viewer-spec.md`](./docs/viewer-spec.md)

英文版文档位于 `README.md`。
