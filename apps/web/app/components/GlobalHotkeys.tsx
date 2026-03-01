/**
 * - [INPUT]: 依赖 `next/navigation` 路由能力、`/api/search` 搜索 API 与浏览器键盘事件
 * - [OUTPUT]: 导出 GlobalHotkeys 组件，提供全局快捷键（Cmd/Ctrl+K, Cmd/Ctrl+D, ?）与搜索弹窗跳转
 * - [POS]: app/components/ 的全局热键中枢，挂载于 layout 以覆盖全部页面
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/CLAUDE.md
 */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toggleLightDarkWithMotion } from "./themeTransition";

interface SearchResult {
  id: string;
  topic: string;
  excerpt: string;
  timestamp: string;
  souls: string[];
}

export function GlobalHotkeys() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchClosing, setSearchClosing] = useState(false);
  const [helpClosing, setHelpClosing] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchCloseTimerRef = useRef<number | null>(null);
  const helpCloseTimerRef = useRef<number | null>(null);

  function openSearchModal() {
    if (searchCloseTimerRef.current) {
      window.clearTimeout(searchCloseTimerRef.current);
      searchCloseTimerRef.current = null;
    }
    setSearchClosing(false);
    setHelpOpen(false);
    setQuery("");
    setResults([]);
    setSearchOpen(true);
  }

  function closeSearchModal() {
    if (searchCloseTimerRef.current) return;
    setSearchClosing(true);
    searchCloseTimerRef.current = window.setTimeout(() => {
      setSearchOpen(false);
      setSearchClosing(false);
      searchCloseTimerRef.current = null;
    }, 180);
  }

  function openHelpModal() {
    if (helpCloseTimerRef.current) {
      window.clearTimeout(helpCloseTimerRef.current);
      helpCloseTimerRef.current = null;
    }
    setHelpClosing(false);
    setSearchOpen(false);
    setHelpOpen(true);
  }

  function closeHelpModal() {
    if (helpCloseTimerRef.current) return;
    setHelpClosing(true);
    helpCloseTimerRef.current = window.setTimeout(() => {
      setHelpOpen(false);
      setHelpClosing(false);
      helpCloseTimerRef.current = null;
    }, 180);
  }

  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();
    searchInputRef.current?.select();
  }, [searchOpen]);

  useEffect(() => {
    const onOpenSearch = () => openSearchModal();
    window.addEventListener("ok:open-search", onOpenSearch as EventListener);
    return () => window.removeEventListener("ok:open-search", onOpenSearch as EventListener);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      const isSearchShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const isThemeShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d";
      if (isSearchShortcut) {
        event.preventDefault();
        openSearchModal();
        return;
      }
      if (isThemeShortcut) {
        event.preventDefault();
        toggleLightDarkWithMotion();
        return;
      }
      if (event.key === "Escape") {
        if (searchOpen) closeSearchModal();
        if (helpOpen) closeHelpModal();
        return;
      }
      if (isTypingTarget) return;
      if (event.key === "?") {
        event.preventDefault();
        openHelpModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [helpOpen, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        const resp = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=12`, {
          cache: "no-store",
        });
        if (!resp.ok) {
          setResults([]);
          return;
        }
        const data = (await resp.json()) as { items?: SearchResult[] };
        setResults(data.items ?? []);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [query, searchOpen]);

  useEffect(() => {
    return () => {
      if (searchCloseTimerRef.current) window.clearTimeout(searchCloseTimerRef.current);
      if (helpCloseTimerRef.current) window.clearTimeout(helpCloseTimerRef.current);
    };
  }, []);

  const hasQuery = useMemo(() => query.trim().length > 0, [query]);

  function openDebate(id: string) {
    closeSearchModal();
    router.push(`/debate/${id}`);
  }

  return (
    <>
      {searchOpen ? (
        <div
          className={`modal-overlay${searchClosing ? " closing" : ""}`}
          onClick={closeSearchModal}
        >
          <div
            className={`modal-content${searchClosing ? " closing" : ""}`}
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(680px, calc(100vw - 40px))",
              padding: 0,
              border: "none",
              background: "transparent",
              boxShadow: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: hasQuery || loading ? 12 : 0,
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "var(--bg-surface)",
                padding: "10px 12px",
                boxShadow: "0 14px 30px rgba(0,0,0,0.22)",
              }}
            >
              <input
                ref={searchInputRef}
                className="modal-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && results[0]) {
                    event.preventDefault();
                    openDebate(results[0].id);
                  }
                }}
                placeholder="搜索话题、人格、正文片段..."
                style={{ marginBottom: 0, padding: "10px 4px", fontSize: 14 }}
              />
            </div>

            {hasQuery || loading ? (
              <div
                style={{
                  maxHeight: 420,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  background: "var(--bg-surface)",
                  padding: 10,
                  boxShadow: "0 14px 30px rgba(0,0,0,0.22)",
                }}
              >
                {loading ? (
                  <SearchHint text="搜索中..." />
                ) : results.length === 0 ? (
                  <SearchHint text="没有找到匹配帖子" />
                ) : (
                  results.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openDebate(item.id)}
                      style={{
                        textAlign: "left",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        background: "var(--bg-base)",
                        padding: "12px 14px",
                        cursor: "pointer",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: 14, color: "var(--text-primary)", fontWeight: 600 }}>
                        {item.topic}
                      </p>
                      <p
                        style={{
                          margin: "6px 0 0",
                          fontSize: 12,
                          color: "var(--text-secondary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.excerpt}
                      </p>
                      <p style={{ margin: "8px 0 0", fontSize: 11, color: "var(--text-muted)" }}>
                        {new Date(item.timestamp).toLocaleString("zh-CN")}
                      </p>
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {helpOpen ? (
        <div
          className={`modal-overlay${helpClosing ? " closing" : ""}`}
          onClick={closeHelpModal}
        >
          <div
            className={`modal-content${helpClosing ? " closing" : ""}`}
            onClick={(event) => event.stopPropagation()}
            style={{ width: "min(520px, calc(100vw - 40px))", padding: 20 }}
          >
            <h3 style={{ margin: "0 0 14px", fontSize: 18, color: "var(--text-primary)" }}>快捷键</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <ShortcutRow keys="⌘/Ctrl + K" desc="打开全局搜索并跳转帖子" />
              <ShortcutRow keys="⌘/Ctrl + D" desc="浅色/深色切换" />
              <ShortcutRow keys="?" desc="打开快捷键列表" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function ShortcutRow({ keys, desc }: { keys: string; desc: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "10px 12px",
        background: "var(--bg-base)",
      }}
    >
      <span style={{ color: "var(--text-primary)", fontSize: 13 }}>{desc}</span>
      <span
        style={{
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "2px 8px",
          color: "var(--text-secondary)",
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {keys}
      </span>
    </div>
  );
}

function SearchHint({ text }: { text: string }) {
  return (
    <div
      style={{
        border: "1px dashed var(--border)",
        borderRadius: 8,
        padding: "16px 14px",
        color: "var(--text-secondary)",
        fontSize: 12,
      }}
    >
      {text}
    </div>
  );
}
