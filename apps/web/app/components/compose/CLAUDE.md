<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与编排请求协议
- [OUTPUT]: 本文档提供 compose/ 成员清单与职责边界
- [POS]: app/components/compose/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# compose/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「compose/」实现具体业务能力，当前重点是 本目录成员文件，承载对应子能力实现。
- 核心文件：`ComposeDialog.module.css`、`ComposeDialog.tsx`。
- 实现原理：通常由入口文件接收请求或参数，再调用同目录实现文件完成处理，最后输出页面、接口响应或可复用函数能力。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；相关实现见本文件“成员清单”。
## 成员清单

- [`ComposeDialog.module.css`](./ComposeDialog.module.css)：本目录成员文件，承载对应子能力实现
- [`ComposeDialog.tsx`](./ComposeDialog.tsx)：React 组件实现文件，负责界面与交互逻辑

