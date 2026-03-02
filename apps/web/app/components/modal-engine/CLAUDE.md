<!--
- [INPUT]: 依赖 app/components/CLAUDE.md 的模块定位与弹窗交互目标
- [OUTPUT]: 提供 modal-engine/ 的成员清单与职责边界
- [POS]: app/components/modal-engine/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 app/components/CLAUDE.md
-->

# modal-engine/
> L2 | 父级: [app/components/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：提供前端交互组件能力，负责状态驱动渲染与用户操作响应，对应目录「modal-engine/」。
- 核心文件：`modal-motion.ts`（TypeScript 业务实现）、`modal-types.ts`（TypeScript 业务实现）、`ModalProvider.module.css`（状态与上下文管理）、`ModalProvider.tsx`（状态与上下文管理）。
- 实现原理：采用“入口 -> 处理 -> 输出”链路：由 `modal-motion.ts` 接入调用，再由 `modal-types.ts` 与 `ModalProvider.module.css` 完成主要处理，最后对上层暴露稳定结果。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；同级协作见本文件“成员清单”。
## 成员清单

- [`modal-motion.ts`](./modal-motion.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`modal-types.ts`](./modal-types.ts)：TypeScript 实现文件，承载本模块核心逻辑
- [`ModalProvider.module.css`](./ModalProvider.module.css)：本目录成员文件，承载对应子能力实现
- [`ModalProvider.tsx`](./ModalProvider.tsx)：React 组件实现文件，负责界面与交互逻辑
- [`useModalEngine.ts`](./useModalEngine.ts)：TypeScript 实现文件，承载本模块核心逻辑

