/**
 * - [INPUT]: 依赖 /api/search 搜索接口与 next/navigation 跳转能力
 * - [OUTPUT]: 导出 SearchDialog 组件，提供搜索输入、结果列表与跳转行为
 * - [POS]: app/components/ 的全局搜索弹窗内容层，由 ModalProvider 统一调度
 * - [PROTOCOL]: 字段协议变更时同步 app/api/search/route.ts 与 app/CLAUDE.md
 */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  topic: string;
  excerpt: string;
  timestamp: string;
  souls: string[];
}

interface SearchDialogProps {
  active: boolean;
  onClose: () => void;
}

export function SearchDialog({ active, onClose }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasQuery = useMemo(() => query.trim().length > 0, [query]);

  useEffect(() => {
    if (!active) return;
    setQuery("");
    setResults([]);
    setLoading(false);
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [active]);

  useEffect(() => {
    if (!active) return;
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
  }, [query, active]);

  function openDebate(id: string) {
    onClose();
    router.push(`/debate/${id}`);
  }

  return (
    <div className="ok-search-sheet">
      <div className="ok-search-input-wrap">
        <input
          ref={inputRef}
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
        <div className="ok-search-result-wrap">
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
                className="ok-search-item"
              >
                <p className="ok-search-item-title">{item.topic}</p>
                <p className="ok-search-item-excerpt">{item.excerpt}</p>
                <p className="ok-search-item-time">
                  {new Date(item.timestamp).toLocaleString("zh-CN")}
                </p>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

function SearchHint({ text }: { text: string }) {
  return <div className="ok-search-hint">{text}</div>;
}
