<!--
- [INPUT]: 依赖 app/components/CLAUDE.md 的模块定位与弹窗交互目标
- [OUTPUT]: 提供 modal-engine/ 的成员清单与职责边界
- [POS]: app/components/modal-engine/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 app/components/CLAUDE.md
-->

# modal-engine/
> L2 | 父级: [app/components/CLAUDE.md](../CLAUDE.md)

成员清单 [modal-types.ts](./modal-types.ts): 弹窗 ID/请求/状态类型定义（`compose`/`search`/`hotkey-help`）。
成员清单 [modal-motion.ts](./modal-motion.ts): 弹窗切换时序常量（`MODAL_SWITCH_MS`）单源定义。
成员清单 [ModalProvider.tsx](./ModalProvider.tsx): 单实例弹窗状态机与统一渲染宿主（交叉淡入淡出切换）。
成员清单 [useModalEngine.ts](./useModalEngine.ts): 业务组件调用入口，统一 `open/close/isOpen/activeModal`。

法则: 只允许一个 active 弹窗·切换状态机单源化·组件不得私有维护 open 状态
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
