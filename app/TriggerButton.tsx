// [INPUT]: 依赖 /api/orchestrate 的流式 NDJSON 响应（meta/chunk/done/error）
// [OUTPUT]: TriggerButton（触发按钮）+ StreamCard（流式渲染卡片），通过 window 事件总线解耦并处理异常消息
// [POS]: app/ 的流式渲染层，L2 级别；唯一的 Client Component 聚合文件
// [PROTOCOL]: 消息协议变更须同步 app/CLAUDE.md；新增流式事件类型须同步 api/orchestrate/route.ts

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

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

export function TriggerButton() {
  const [showModal, setShowModal] = useState(false);
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setShowModal(false);
    window.dispatchEvent(new CustomEvent("stream:start"));

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, context }),
      });
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `Request failed with status ${res.status}`);
      }
      if (!res.body) {
        throw new Error("响应体为空，无法开始流式渲染");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const emit = (msg: StreamMessage) => {
        window.dispatchEvent(new CustomEvent("stream:msg", { detail: msg }));
        if (msg.type === "done" || msg.type === "error") {
          setLoading(false);
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          try {
            emit(JSON.parse(line) as StreamMessage);
          } catch (error) {
            console.warn("Invalid NDJSON line from /api/orchestrate:", error);
          }
        }
      }

      buffer += decoder.decode();
      const tail = buffer.trim();
      if (tail) {
        try {
          emit(JSON.parse(tail) as StreamMessage);
        } catch (error) {
          console.warn("Invalid NDJSON tail from /api/orchestrate:", error);
        }
      }
    } catch (err) {
      console.error("Failed to orchestrate:", err);
      const message = err instanceof Error ? err.message : "编排失败";
      window.dispatchEvent(
        new CustomEvent("stream:msg", {
          detail: { type: "error", message } satisfies StreamMessage,
        }),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        style={{
          padding: "8px 18px",
          background: loading ? "var(--bg-elevated)" : "var(--accent)",
          color: loading ? "var(--text-muted)" : "var(--accent-fg)",
          border: "none",
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {loading ? "正在播种..." : "+ 发起讨论"}
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, marginBottom: 32, fontWeight: 600 }}>
              发起新的思想博弈
            </h2>

            <label className="modal-label">讨论话题</label>
            <input
              autoFocus
              className="modal-input"
              placeholder="例如：AI 时代的数字遗产归属..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
            />

            <label className="modal-label">上下文背景 (可选)</label>
            <textarea
              className="modal-input"
              style={{ minHeight: 80, resize: "none" }}
              placeholder="提供一些背景信息，让讨论更具针对性..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                取消
              </button>
              <button
                onClick={handleStart}
                disabled={!topic.trim()}
                style={{
                  flex: 2,
                  padding: "12px",
                  background: topic.trim()
                    ? "var(--accent)"
                    : "var(--bg-elevated)",
                  color: topic.trim()
                    ? "var(--accent-fg)"
                    : "var(--text-muted)",
                  border: "none",
                  borderRadius: 6,
                  cursor: topic.trim() ? "pointer" : "not-allowed",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                播种意图
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
