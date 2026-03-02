/**
- [INPUT]: 依赖上层模块传入的参数、上下文与基础能力
- [OUTPUT]: 对外提供 ComposeDialog.tsx 的核心实现能力
- [POS]: apps/web/app/components/compose/ 的实现文件，和同目录成员协作完成模块能力
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
*/

/**
 * - [INPUT]: 依赖 /api/orchestrate 流式 NDJSON 响应、SOULS 预设人格与 ModalEngine 关闭能力
 * - [OUTPUT]: 导出 ComposeDialog 组件，提供发帖表单与提交动作
 * - [POS]: app/components/ 的发帖弹窗内容层，由 ModalProvider 托管显示与切换
 * - [PROTOCOL]: 消息协议变更须同步 TriggerButton.tsx；字段变更须同步 app/CLAUDE.md
 */
"use client";

import { useEffect, useRef, useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { SOULS } from "../../../src/orchestration/soul";
import { MODAL_SWITCH_MS } from "../modal-engine/modal-motion";
import styles from "./ComposeDialog.module.css";

type StreamMessage =
  | { type: "meta"; soul: string; topic: string; timestamp: string }
  | { type: "chunk"; text: string }
  | { type: "done"; filename: string }
  | { type: "error"; message: string };

interface ComposeDialogProps {
  active: boolean;
  onClose: () => void;
}

function parseMultiLine(value: string): string[] {
  const normalized = value.replace(/\\n/g, "\n");
  return normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function ComposeDialog({ active, onClose }: ComposeDialogProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [soulId, setSoulId] = useState(SOULS[0]?.id ?? "");
  const [referencesText, setReferencesText] = useState("");
  const [mustCoverText, setMustCoverText] = useState("");
  const [mustAvoidText, setMustAvoidText] = useState("");
  const [loading, setLoading] = useState(false);
  const topicInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!active) return;
    topicInputRef.current?.focus();
    topicInputRef.current?.select();
  }, [active]);

  useEffect(() => {
    if (!active) {
      const timer = window.setTimeout(() => {
        setShowAdvanced(false);
        setTopic("");
        setContext("");
        setReferencesText("");
        setMustCoverText("");
        setMustAvoidText("");
      }, MODAL_SWITCH_MS);
      return () => window.clearTimeout(timer);
    }
  }, [active]);

  async function handleStart() {
    if (!topic.trim() || loading) return;
    setLoading(true);
    onClose();
    window.dispatchEvent(new CustomEvent("stream:start"));

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          context: context.trim(),
          soul_id: soulId || undefined,
          references: parseMultiLine(referencesText),
          must_cover: parseMultiLine(mustCoverText),
          must_avoid: parseMultiLine(mustAvoidText),
        }),
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
    } catch (error) {
      const message = error instanceof Error ? error.message : "编排失败";
      window.dispatchEvent(
        new CustomEvent("stream:msg", {
          detail: { type: "error", message } satisfies StreamMessage,
        }),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.title}>发起新的思想博弈</h2>
      </div>

      <div className={styles.body}>
        <label className={styles.label}>讨论话题</label>
        <input
          ref={topicInputRef}
          className={styles.input}
          placeholder="例如：AI 时代的数字遗产归属..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleStart()}
        />

        <label className={styles.label}>人格视角</label>
        <select
          className={styles.input}
          value={soulId}
          onChange={(e) => setSoulId(e.target.value)}
        >
          {SOULS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

        <label className={styles.label}>上下文背景 (可选)</label>
        <textarea
          className={styles.input}
          style={{ minHeight: 90, resize: "vertical" }}
          placeholder="提供一些背景信息，让讨论更具针对性..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />

        <Collapsible.Root open={showAdvanced} onOpenChange={setShowAdvanced}>
          <Collapsible.Trigger asChild>
            <button type="button" className={styles.advancedTrigger}>
              {showAdvanced ? "▾ 收起高级输入" : "▸ 展开高级输入"}
            </button>
          </Collapsible.Trigger>

          <Collapsible.Content className={styles.advancedContent}>
            <div className={styles.advancedHead}>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>
                高级输入用于约束生成结果，留空则按默认策略运行
              </p>
              <button
                type="button"
                onClick={() => {
                  setReferencesText("");
                  setMustCoverText("");
                  setMustAvoidText("");
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontSize: 12,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                清空
              </button>
            </div>

            <label className={styles.label}>参考资料 (每行一条，可填链接或文本)</label>
            <textarea
              className={styles.input}
              style={{ minHeight: 92, resize: "vertical" }}
              placeholder={"https://example.com/article\n关键数据：2025 年渗透率为 37%"}
              value={referencesText}
              onChange={(e) => setReferencesText(e.target.value)}
            />
            <p className={styles.dialogHint}>支持直接粘贴带 `\\n` 的文本，系统会自动分行。</p>

            <label className={styles.label}>必须覆盖点 (每行一条)</label>
            <textarea
              className={styles.input}
              style={{ minHeight: 92, resize: "vertical" }}
              placeholder={"商业激励机制\n技术伦理边界"}
              value={mustCoverText}
              onChange={(e) => setMustCoverText(e.target.value)}
            />

            <label className={styles.label}>禁止触碰点 (每行一条)</label>
            <textarea
              className={styles.input}
              style={{ minHeight: 92, resize: "vertical" }}
              placeholder={"避免人身攻击\n不输出无证据断言"}
              value={mustAvoidText}
              onChange={(e) => setMustAvoidText(e.target.value)}
            />
          </Collapsible.Content>
        </Collapsible.Root>
      </div>

      <div className={styles.footer}>
        <button
          onClick={onClose}
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
          disabled={!topic.trim() || loading}
          style={{
            flex: 2,
            padding: "12px",
            background: topic.trim() ? "var(--accent)" : "var(--bg-elevated)",
            color: topic.trim() ? "var(--accent-fg)" : "var(--text-muted)",
            border: "none",
            borderRadius: 6,
            cursor: topic.trim() ? "pointer" : "not-allowed",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {loading ? "正在播种..." : "播种意图"}
        </button>
      </div>
    </>
  );
}
