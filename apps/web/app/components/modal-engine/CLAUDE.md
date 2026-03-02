<!--
- [INPUT]: 依赖 app/components/CLAUDE.md 的模块定位与弹窗交互目标
- [OUTPUT]: 提供 modal-engine/ 的成员清单与职责边界
- [POS]: app/components/modal-engine/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 app/components/CLAUDE.md
-->

# modal-engine/

> L2 | 父级: [app/components/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「modal-engine/」负责 前端交互与状态驱动渲染，当前由 `modal-motion.ts` 等文件对外提供能力，典型使用场景是页面渲染与用户交互触发时。
- 核心文件：`modal-motion.ts`（逻辑实现）、`modal-types.ts`（逻辑实现）、`ModalProvider.module.css`（状态容器）、`ModalProvider.tsx`（状态容器）
- 实现原理：由 `modal-motion.ts` 接收入口，再通过 `modal-types.ts` 和 `ModalProvider.module.css` 完成核心处理；遇到参数不合法或依赖缺失时立即中断并返回明确错误。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖或子模块包括 `modal-motion.ts`、`modal-types.ts`、`ModalProvider.module.css`、`ModalProvider.tsx`。
- 调用链路：`modal-motion.ts` -> `modal-types.ts` -> `ModalProvider.module.css` -> 输出

## 成员清单

- [`modal-motion.ts`](./modal-motion.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`modal-types.ts`](./modal-types.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`ModalProvider.module.css`](./ModalProvider.module.css)：本目录成员文件，承载对应子能力实现
- [`ModalProvider.tsx`](./ModalProvider.tsx)：React 组件实现文件，负责界面与交互逻辑
- [`useModalEngine.ts`](./useModalEngine.ts)：TypeScript 实现文件，承载本模块核心逻辑
