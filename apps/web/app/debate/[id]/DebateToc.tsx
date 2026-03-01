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
  depth: number;
}

export function DebateToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  useEffect(() => {
    // 1. 缓存 DOM 元素，不用每次 scroll 都查
    // 这样避免了由于频繁调用 getElementById 和导致 layout 抖动
    const headingElements = items
      .map((item) => {
        const el = document.getElementById(item.id);
        return el ? { id: item.id, el } : null;
      })
      .filter(Boolean) as { id: string; el: HTMLElement }[];

    if (headingElements.length === 0) return;

    let ticking = false;

    const updateActiveId = () => {
      let currentActiveId = items[0].id;
      for (const { id, el } of headingElements) {
        const rect = el.getBoundingClientRect();
        // 设置 150px 为触发阈值（视口顶端往下150px，通常跨过了sticky顶栏和标题一部分阅读区）
        if (rect.top <= 150) {
          currentActiveId = id;
        } else {
          // 因为元素在 DOM 中按顺序排列，一旦某个元素还未到达顶部以上，
          // 说明它是下一个未读章节，它的上一个就是我们正在阅读的章节。
          break;
        }
      }

      // 滑动到底部时自动高亮最后一个目录项
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10
      ) {
        currentActiveId = items[items.length - 1].id;
      }

      setActiveId(currentActiveId);
      ticking = false;
    };

    const handleScroll = () => {
      // 2. 使用 requestAnimationFrame 节流，确保 1 帧内只执行一次计算
      if (!ticking) {
        window.requestAnimationFrame(updateActiveId);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // 首次载入也检查一次位置
    updateActiveId();

    return () => window.removeEventListener("scroll", handleScroll);
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
          <li
            key={item.id}
            style={{ marginLeft: item.depth > 0 ? `${item.depth * 10}px` : 0 }}
          >
            <button
              className={`debate-toc-item${item.depth > 0 ? " sub-item" : ""}${activeId === item.id ? " active" : ""}`}
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
