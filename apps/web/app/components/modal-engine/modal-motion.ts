/**
 * - [INPUT]: 无外部输入，作为 modal-engine 动画时序常量
 * - [OUTPUT]: 导出 MODAL_SWITCH_MS，供状态机计时与弹窗内容清理复用
 * - [POS]: app/components/modal-engine/ 的时序基线层，避免多处硬编码时长漂移
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/components/CLAUDE.md
 */

export const MODAL_SWITCH_MS = 280;
