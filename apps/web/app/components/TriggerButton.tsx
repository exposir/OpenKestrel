// [INPUT]: 依赖 ModalEngine 的 open("compose") 与 /api/orchestrate 的流式 NDJSON 响应（meta/chunk/done/error）
// [OUTPUT]: TriggerButton（触发按钮）+ StreamCard（流式渲染卡片），通过 window 事件总线解耦并处理异常消息
// [POS]: app/ 的流式渲染层，L2 级别；唯一的 Client Component 聚合文件
// [PROTOCOL]: 消息协议变更须同步 app/CLAUDE.md；新增流式事件类型须同步 api/orchestrate/route.ts

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useModalEngine } from "./modal-engine/useModalEngine";

interface StreamCard {
  soul: string;
  topic: string;
  timestamp: string;
  content: string;
  filename?: string;
  done: boolean;
}

type StreamMessage =
  | { type: "meta"; soul: string; topic: string; timestamp: string }
  | { type: "chunk"; text: string }
  | { type: "done"; filename: string }
  | { type: "error"; message: string };

interface TriggerButtonProps {
  isAuthenticated: boolean;
}

export function TriggerButton({ isAuthenticated }: TriggerButtonProps) {
  const { open } = useModalEngine();

  return (
    <button
      className={`ok-compose-trigger-btn ${isAuthenticated ? "ok-compose-trigger-btn-enabled" : "ok-compose-trigger-btn-disabled"}`}
      type="button"
      onClick={() => open("compose", "button")}
      disabled={!isAuthenticated}
      title={!isAuthenticated ? "请先登录后再发帖" : undefined}
      style={{
        padding: "8px 18px",
        border: "none",
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 600,
        cursor: !isAuthenticated ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {!isAuthenticated ? "登录后可发帖" : "+ 发起讨论"}
    </button>
  );
}

export function StreamCard() {
  const [card, setCard] = useState<StreamCard | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [card?.content]);

  useEffect(() => {
    const onStart = () => setCard(null);
    const onMsg = (e: Event) => {
      const msg = (e as CustomEvent).detail;
      if (msg.type === "meta") {
        setCard({
          soul: msg.soul,
          topic: msg.topic,
          timestamp: msg.timestamp,
          content: "",
          done: false,
        });
      } else if (msg.type === "chunk") {
        setCard((prev) =>
          prev ? { ...prev, content: prev.content + msg.text } : prev,
        );
      } else if (msg.type === "done") {
        setCard((prev) =>
          prev ? { ...prev, done: true, filename: msg.filename } : prev,
        );
      } else if (msg.type === "error") {
        setCard((prev) =>
          prev
            ? {
                ...prev,
                done: true,
                content: prev.content || `生成失败：${msg.message}`,
              }
            : {
                soul: "系统",
                topic: "编排失败",
                timestamp: new Date().toISOString(),
                content: `生成失败：${msg.message}`,
                done: true,
              },
        );
      }
    };

    window.addEventListener("stream:start", onStart);
    window.addEventListener("stream:msg", onMsg as EventListener);
    return () => {
      window.removeEventListener("stream:start", onStart);
      window.removeEventListener("stream:msg", onMsg as EventListener);
    };
  }, []);

  if (!card) return null;

  return (
    <div
      style={{
        marginTop: 24,
        border: "1px solid var(--border)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 20px",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 20,
            background: "var(--tag-bg)",
            border: "1px solid var(--tag-border)",
            color: "var(--tag-text)",
          }}
        >
          {card.soul}
        </span>
        {!card.done && (
          <span
            className="animate-blink"
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginLeft: "auto",
            }}
          >
            ▋ 生成中
          </span>
        )}
        {card.done && (
          <span
            style={{
              fontSize: 11,
              color: "var(--success)",
              marginLeft: "auto",
            }}
          >
            ✓ 完成
          </span>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <div
          ref={scrollRef}
          className={!card.done ? "no-scrollbar" : ""}
          style={{
            padding: "20px 24px",
            background: "var(--bg-base)",
            maxHeight: 400,
            overflowY: "auto",
            fontSize: 15,
            lineHeight: 1.8,
            color: "var(--text-primary)",
            // Disable pointer events for scrolling during generation
            pointerEvents: !card.done ? "none" : "auto",
            // Apply fade out mask when not done
            maskImage:
              "linear-gradient(to bottom, black 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 80%, transparent 100%)",
          }}
        >
          <ReactMarkdown>
            {card.content + (!card.done ? " ▋" : "")}
          </ReactMarkdown>
        </div>
      </div>

      {card.done && card.filename && (
        <div
          style={{
            padding: "10px 24px",
            background: "var(--bg-base)",
            borderTop: "1px solid var(--border-muted)",
          }}
        >
          <Link
            href={`/debate/${card.filename}`}
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            查看完整记录 →
          </Link>
        </div>
      )}
    </div>
  );
}
