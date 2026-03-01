/**
 * - [INPUT]: 接收 `items` 锚点数据 (id + label)
 * - [OUTPUT]: 对外提供 `DebateToc` 客户端组件
 * - [POS]: debate/[id]/ 的左侧目录导航，监听滚动高亮 + 点击平滑跳转
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/CLAUDE.md
 */
"use client";

import { useEffect, useRef, useState } from "react";

interface TocItem {
  id: string;
  label: string;
}

export function DebateToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);
  // 用一个 ref 维护当前所有可见元素的 id
  const visibleIdsRef = useRef(new Set<string>());

  useEffect(() => {
    // ── IntersectionObserver: track visible articles ──
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    // 每次 items 更新，重置一下可见元素集合
    visibleIdsRef.current.clear();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        let isChanged = false;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleIdsRef.current.add(entry.target.id);
            isChanged = true;
          } else {
            visibleIdsRef.current.delete(entry.target.id);
            isChanged = true;
          }
        });

        // 如果可见状态发生改变，从上到下找出第一个可见的元素 ID
        if (isChanged && visibleIdsRef.current.size > 0) {
          const firstVisibleItem = items.find((item) =>
            visibleIdsRef.current.has(item.id),
          );
          if (firstVisibleItem) {
            setActiveId(firstVisibleItem.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 },
    );

    elements.forEach((el) => observerRef.current!.observe(el));

    return () => observerRef.current?.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (items.length === 0) return null;

  return (
    <nav className="debate-toc" aria-label="目录导航">
      <p className="debate-toc-title">目录</p>
      <ul className="debate-toc-list">
        {items.map((item) => (
          <li key={item.id}>
            <button
              className={`debate-toc-item${activeId === item.id ? " active" : ""}`}
              onClick={() => handleClick(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
