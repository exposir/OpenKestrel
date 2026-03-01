<!--
- [INPUT]: 依赖 ../CLAUDE.md 的包级协作规则与导出约束
- [OUTPUT]: 提供 dep-graph 包成员清单与能力边界
- [POS]: packages/dep-graph/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
-->

# dep-graph/
> L2 | Parent: [packages/CLAUDE.md](../CLAUDE.md)

成员清单 [package.json](./package.json): 包元数据、bin 命令与构建脚本定义。  
成员清单 [tsconfig.build.json](./tsconfig.build.json): 库构建 TS 配置（输出 ESM + d.ts 到 dist）。  
成员清单 [src/index.ts](./src/index.ts): SDK 默认入口（分析/算法/viewer API 导出）。  
成员清单 [src/cli.ts](./src/cli.ts): `okdep` 命令入口（analyze/web/print-cycles/print-mesh）。  
成员清单 [src/types.ts](./src/types.ts): 报告协议与公共类型定义。  
成员清单 [src/analyzer/index.ts](./src/analyzer/index.ts): 分析编排入口（scan -> graph -> report）。  
成员清单 [src/analyzer/scan.ts](./src/analyzer/scan.ts): 代码扫描与依赖抽取（es-module-lexer + ts resolve）。  
成员清单 [src/analyzer/tsconfig.ts](./src/analyzer/tsconfig.ts): tsconfig 读取与 resolver 上下文。  
成员清单 [src/analyzer/path-utils.ts](./src/analyzer/path-utils.ts): 路径标准化与聚合键工具。  
成员清单 [src/graph/algorithms.ts](./src/graph/algorithms.ts): SCC/网状识别/闭包大小/聚合图算法。  
成员清单 [src/viewer-server/index.ts](./src/viewer-server/index.ts): 本地 HTTP viewer 服务与 `/api/report`。  
成员清单 [src/viewer-app/index.html](./src/viewer-app/index.html): 可视化页面骨架。  
成员清单 [src/viewer-app/app.js](./src/viewer-app/app.js): WebGL 图渲染、搜索与详情交互。  
成员清单 [src/viewer-app/style.css](./src/viewer-app/style.css): viewer 页面布局与样式。

法则: 分析链路线性复杂度优先·默认聚合视图后按需展开·CLI 与 SDK 同源数据协议
