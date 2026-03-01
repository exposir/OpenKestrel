/**
 * - [INPUT]: 依赖 ModalProvider 提供的 React Context
 * - [OUTPUT]: 导出 useModalEngine Hook，向业务组件暴露统一弹窗控制 API
 * - [POS]: app/components/modal-engine/ 的消费入口，约束组件只能通过引擎操作弹窗
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/components/CLAUDE.md
 */
"use client";

import { useContext } from "react";
import { ModalEngineContext } from "./ModalProvider";

export function useModalEngine() {
  const ctx = useContext(ModalEngineContext);
  if (!ctx) {
    throw new Error("useModalEngine must be used within <ModalProvider>");
  }
  return ctx;
}
