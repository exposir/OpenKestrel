<!--
- [INPUT]: 依赖 ../CLAUDE.md 的包级协作规则与导出约束
- [OUTPUT]: 提供 theme-motion 包的成员清单与发布边界
- [POS]: packages/theme-motion/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 ../CLAUDE.md
-->

# theme-motion/
> L2 | Parent: [packages/CLAUDE.md](../CLAUDE.md)

成员清单 [package.json](./package.json): 包元数据与 exports/build 脚本定义。  
成员清单 [tsconfig.build.json](./tsconfig.build.json): 库构建 TS 配置（输出 ESM + d.ts 到 dist）。  
成员清单 [src/index.ts](./src/index.ts): 默认入口（re-export core API）。  
成员清单 [src/core.ts](./src/core.ts): 无框架主题切换内核（即时切换 + View Transition 动画）。  
成员清单 [src/react.ts](./src/react.ts): React Hook 与 DOM 起点坐标工具封装。  
成员清单 [src/style.css](./src/style.css): 主题扩散动画样式与 VT 指针穿透规则。

法则: core 无框架依赖·react 仅做薄封装·css 可选按需引入
