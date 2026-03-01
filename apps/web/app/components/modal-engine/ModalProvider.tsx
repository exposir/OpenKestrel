/**
 * - [INPUT]: 依赖 Radix Dialog 与 Compose/Search/Help 三类弹窗面板
 * - [OUTPUT]: 导出 ModalProvider 与 ModalEngineContext，提供单实例弹窗状态机与统一渲染宿主
 * - [POS]: app/components/modal-engine/ 的运行时核心，负责弹窗切换编排与快捷事件桥接
 * - [PROTOCOL]: 变更时更新此头部，然后检查 app/components/CLAUDE.md
 */
"use client";

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { ModalId, ModalSource, ModalState } from "./modal-types";
import { ComposeDialog } from "../ComposeDialog";
import { SearchDialog } from "../SearchDialog";
import { HotkeyHelpDialog } from "../HotkeyHelpDialog";

const SWITCH_MS = 220;

interface InternalModalState extends ModalState {
  exiting: ModalId | null;
}

interface ModalEngineContextValue {
  open: (id: ModalId, source?: ModalSource, payload?: unknown) => void;
  close: () => void;
  activeModal: ModalId | null;
  isOpen: (id: ModalId) => boolean;
}

export const ModalEngineContext = createContext<ModalEngineContextValue | null>(null);

function getModalLabel(id: ModalId): string {
  switch (id) {
    case "compose":
      return "发起新的思想博弈";
    case "search":
      return "全局搜索";
    case "hotkey-help":
      return "快捷键帮助";
  }
}

function getShellClassName(id: ModalId | null): string {
  switch (id) {
    case "compose":
      return "ok-modal-shell ok-modal-shell-compose";
    case "search":
      return "ok-modal-shell ok-modal-shell-search";
    case "hotkey-help":
      return "ok-modal-shell ok-modal-shell-help";
    default:
      return "ok-modal-shell";
  }
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InternalModalState>({
    active: null,
    phase: "idle",
    next: null,
    exiting: null,
  });
  const switchTimerRef = useRef<number | null>(null);

  const open = useCallback((id: ModalId, _source: ModalSource = "event", _payload?: unknown) => {
    setState((prev) => {
      if (prev.active === id && prev.phase !== "switching") {
        return prev;
      }
      if (prev.active === null) {
        return {
          active: id,
          phase: prev.exiting ? "switching" : "idle",
          next: prev.exiting ? id : null,
          exiting: prev.exiting,
        };
      }
      return {
        active: id,
        phase: "switching",
        next: id,
        exiting: prev.active,
      };
    });
  }, []);

  const close = useCallback(() => {
    setState((prev) => {
      if (!prev.active) return prev;
      return {
        active: null,
        phase: "switching",
        next: null,
        exiting: prev.active,
      };
    });
  }, []);

  useEffect(() => {
    if (state.phase !== "switching") return;
    if (switchTimerRef.current) {
      window.clearTimeout(switchTimerRef.current);
    }
    switchTimerRef.current = window.setTimeout(() => {
      setState((prev) => ({
        ...prev,
        phase: "idle",
        next: null,
        exiting: null,
      }));
      switchTimerRef.current = null;
    }, SWITCH_MS);
    return () => {
      if (switchTimerRef.current) {
        window.clearTimeout(switchTimerRef.current);
      }
    };
  }, [state.phase, state.active, state.exiting]);

  useEffect(() => {
    const onOpenSearch = () => open("search", "event");
    const onOpenCompose = () => open("compose", "event");
    const onOpenHelp = () => open("hotkey-help", "event");
    const onClose = () => close();
    window.addEventListener("ok:open-search", onOpenSearch as EventListener);
    window.addEventListener("ok:open-compose", onOpenCompose as EventListener);
    window.addEventListener("ok:open-hotkey-help", onOpenHelp as EventListener);
    window.addEventListener("ok:close-modal", onClose as EventListener);
    return () => {
      window.removeEventListener("ok:open-search", onOpenSearch as EventListener);
      window.removeEventListener("ok:open-compose", onOpenCompose as EventListener);
      window.removeEventListener("ok:open-hotkey-help", onOpenHelp as EventListener);
      window.removeEventListener("ok:close-modal", onClose as EventListener);
    };
  }, [open, close]);

  const currentModal = state.active ?? state.exiting;
  const contextValue = useMemo<ModalEngineContextValue>(
    () => ({
      open,
      close,
      activeModal: state.active,
      isOpen: (id: ModalId) => state.active === id,
    }),
    [open, close, state.active],
  );

  const renderPanel = (id: ModalId, active: boolean) => {
    switch (id) {
      case "compose":
        return <ComposeDialog active={active} onClose={close} />;
      case "search":
        return <SearchDialog active={active} onClose={close} />;
      case "hotkey-help":
        return <HotkeyHelpDialog active={active} onClose={close} />;
    }
  };

  return (
    <ModalEngineContext.Provider value={contextValue}>
      {children}
      <Dialog.Root open={Boolean(currentModal)} onOpenChange={(isOpen) => !isOpen && close()}>
        <Dialog.Portal>
          <Dialog.Overlay className="ok-modal-overlay" />
          <Dialog.Content className={getShellClassName(currentModal)}>
            <Dialog.Title className="sr-only">
              {currentModal ? getModalLabel(currentModal) : "对话弹窗"}
            </Dialog.Title>
            <div className="ok-modal-stage">
              {state.exiting ? (
                <div className="ok-modal-panel ok-modal-exit" data-modal-id={state.exiting}>
                  {renderPanel(state.exiting, false)}
                </div>
              ) : null}
              {state.active ? (
                <div
                  className={`ok-modal-panel ${state.phase === "switching" && state.exiting ? "ok-modal-enter" : "ok-modal-active"}`}
                  data-modal-id={state.active}
                >
                  {renderPanel(state.active, true)}
                </div>
              ) : null}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ModalEngineContext.Provider>
  );
}
