// [INPUT]: 依赖 /api/orchestrate 的流式 NDJSON 响应
// [OUTPUT]: TriggerButton（触发按钮）+ StreamCard（流式渲染卡片），通过 window 事件总线解耦
// [POS]: app/ 的流式渲染层，L2 级别；唯一的 Client Component 聚合文件
// [PROTOCOL]: 消息协议变更须同步 app/CLAUDE.md；新增流式事件类型须同步 api/orchestrate/route.ts

"use client";

import { useState, useEffect } from "react";
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

export function TriggerButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    window.dispatchEvent(new CustomEvent("stream:start"));

    const res = await fetch("/api/orchestrate", { method: "POST" });
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const lines = decoder.decode(value).split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const msg = JSON.parse(line);
          window.dispatchEvent(new CustomEvent("stream:msg", { detail: msg }));
          if (msg.type === "done") {
            setLoading(false);
            setTimeout(() => window.location.reload(), 800);
          }
        } catch {}
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        padding: "8px 18px",
        background: loading ? "#222" : "#fff",
        color: loading ? "#666" : "#000",
        border: "none",
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {loading ? "生成中..." : "+ 发起讨论"}
    </button>
  );
}

export function StreamCard() {
  const [card, setCard] = useState<StreamCard | null>(null);

  useEffect(() => {
    const onStart = () => setCard(null);
    const onMsg = (e: Event) => {
      const msg = (e as CustomEvent).detail;
      if (msg.type === "meta") {
        setCard({ soul: msg.soul, topic: msg.topic, timestamp: msg.timestamp, content: "", done: false });
      } else if (msg.type === "chunk") {
        setCard((prev) => prev ? { ...prev, content: prev.content + msg.text } : prev);
      } else if (msg.type === "done") {
        setCard((prev) => prev ? { ...prev, done: true, filename: msg.filename } : prev);
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
    <div style={{
      marginTop: 24,
      border: "1px solid #2a2a2a",
      borderRadius: 8,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "10px 20px",
        background: "#111",
        borderBottom: "1px solid #222",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <span style={{
          fontSize: 11,
          padding: "2px 8px",
          borderRadius: 20,
          background: "#1a1a1a",
          border: "1px solid #333",
          color: "#aaa",
        }}>
          {card.soul}
        </span>
        {!card.done && <span style={{ fontSize: 11, color: "#444", marginLeft: "auto" }}>▋ 生成中</span>}
        {card.done && <span style={{ fontSize: 11, color: "#3a3", marginLeft: "auto" }}>✓ 完成</span>}
      </div>

      <div style={{ padding: "20px 24px", background: "#0d0d0d", maxHeight: 400, overflowY: "auto", fontSize: 15, lineHeight: 1.8, color: "#ccc" }}>
            <ReactMarkdown>{card.content + (!card.done ? " ▋" : "")}</ReactMarkdown>
          </div>

      {card.done && card.filename && (
        <div style={{ padding: "10px 24px", background: "#0a0a0a", borderTop: "1px solid #1a1a1a" }}>
          <Link href={`/debate/${card.filename}`} style={{ fontSize: 12, color: "#666", textDecoration: "none" }}>
            查看完整记录 →
          </Link>
        </div>
      )}
    </div>
  );
}
