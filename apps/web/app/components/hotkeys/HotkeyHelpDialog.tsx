/**
- [INPUT]: 依赖上层模块传入的参数、上下文与基础能力
- [OUTPUT]: 对外提供 HotkeyHelpDialog.tsx 的核心实现能力
- [POS]: apps/web/app/components/hotkeys/ 的实现文件，和同目录成员协作完成模块能力
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
*/

/**
 * - [INPUT]: 依赖全局热键约定（Cmd/Ctrl + K、Cmd/Ctrl + D、?）
 * - [OUTPUT]: 导出 HotkeyHelpDialog 组件，展示快捷键说明
 * - [POS]: app/components/ 的快捷键帮助弹窗内容层，由 ModalProvider 统一调度
 * - [PROTOCOL]: 快捷键映射变更时同步 GlobalHotkeys.tsx 与 app/CLAUDE.md
 */
"use client";
import styles from "./HotkeyHelpDialog.module.css";

interface HotkeyHelpDialogProps {
  active: boolean;
  onClose: () => void;
}

export function HotkeyHelpDialog({ active, onClose }: HotkeyHelpDialogProps) {
  return (
    <div className={styles.sheet}>
      <div className={styles.header}>
        <h3 style={{ margin: 0, fontSize: 18, color: "var(--text-primary)" }}>快捷键</h3>
        <button type="button" className={styles.close} onClick={onClose}>
          关闭
        </button>
      </div>
      <div className={styles.list}>
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
    <div className={styles.row}>
      <span className={styles.desc}>{desc}</span>
      <span className={styles.kbd}>{keys}</span>
    </div>
  );
}
