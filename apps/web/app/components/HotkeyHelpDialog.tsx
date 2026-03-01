/**
 * - [INPUT]: 依赖全局热键约定（Cmd/Ctrl + K、Cmd/Ctrl + D、?）
 * - [OUTPUT]: 导出 HotkeyHelpDialog 组件，展示快捷键说明
 * - [POS]: app/components/ 的快捷键帮助弹窗内容层，由 ModalProvider 统一调度
 * - [PROTOCOL]: 快捷键映射变更时同步 GlobalHotkeys.tsx 与 app/CLAUDE.md
 */
"use client";

interface HotkeyHelpDialogProps {
  active: boolean;
  onClose: () => void;
}

export function HotkeyHelpDialog({ active, onClose }: HotkeyHelpDialogProps) {
  return (
    <div className="ok-help-sheet">
      <div className="ok-help-header">
        <h3 style={{ margin: 0, fontSize: 18, color: "var(--text-primary)" }}>快捷键</h3>
        <button type="button" className="ok-help-close" onClick={onClose}>
          关闭
        </button>
      </div>
      <div className="ok-help-list">
        <ShortcutRow keys="⌘/Ctrl + K" desc="打开全局搜索并跳转帖子" />
        <ShortcutRow keys="⌘/Ctrl + D" desc="浅色/深色切换" />
        <ShortcutRow keys="?" desc="打开快捷键列表" />
        <ShortcutRow keys="Esc" desc="关闭当前弹窗" />
      </div>
      {!active ? <span className="sr-only">切换中</span> : null}
    </div>
  );
}

function ShortcutRow({ keys, desc }: { keys: string; desc: string }) {
  return (
    <div className="ok-help-row">
      <span style={{ color: "var(--text-primary)", fontSize: 13 }}>{desc}</span>
      <span className="ok-help-kbd">{keys}</span>
    </div>
  );
}
