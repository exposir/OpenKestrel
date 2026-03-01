/**
 * - [INPUT]: 无外部输入，作为弹窗引擎类型基线
 * - [OUTPUT]: 导出 ModalId / ModalRequest / ModalState 等类型
 * - [POS]: app/components/modal-engine/ 的类型定义层，供 Provider 与业务弹窗组件复用
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/components/CLAUDE.md
 */

export type ModalId = "compose" | "search" | "hotkey-help";

export type ModalSource = "button" | "shortcut" | "event";

export interface ModalRequest {
  id: ModalId;
  source: ModalSource;
  payload?: unknown;
}

export interface ModalState {
  active: ModalId | null;
  phase: "idle" | "switching";
}
