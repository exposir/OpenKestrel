<!--
- [INPUT]: 依赖 app/components/CLAUDE.md 的模块定位与弹窗交互目标
- [OUTPUT]: 提供 modal-engine/ 的成员清单与职责边界
- [POS]: app/components/modal-engine/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 app/components/CLAUDE.md
-->

# modal-engine/
> L2 | 父级: [app/components/CLAUDE.md](../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「modal-engine/」实现具体业务能力，当前重点是 TypeScript 实现文件，承载本模块核心逻辑。
- 核心文件：`modal-motion.ts`、`modal-types.ts`、`ModalProvider.module.css`、`ModalProvider.tsx`。
- 实现原理：通常由入口文件接收请求或参数，再调用同目录实现文件完成处理，最后输出页面、接口响应或可复用函数能力。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；相关实现见本文件“成员清单”。
## 成员清单

- [`modal-motion.ts`](./modal-motion.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`modal-types.ts`](./modal-types.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`ModalProvider.module.css`](./ModalProvider.module.css)：本目录成员文件，承载对应子能力实现
- [`ModalProvider.tsx`](./ModalProvider.tsx)：React 组件实现文件，负责界面与交互逻辑
- [`useModalEngine.ts`](./useModalEngine.ts)：TypeScript 实现文件，承载本模块核心逻辑

