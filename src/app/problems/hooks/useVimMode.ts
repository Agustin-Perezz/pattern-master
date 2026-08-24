"use client";

import type { editor } from "monaco-editor";
import { useCallback, useEffect, useRef, useState } from "react";

const VIM_MODE_STORAGE_KEY = "patternmaster:vim-mode";
const MONACO_VIM_CDN =
  "https://unpkg.com/monaco-vim@0.4.4/dist/monaco-vim.umd.js";

type VimAdapter = { dispose: () => void };

type InitVimMode = (
  editor: editor.IStandaloneCodeEditor,
  statusbar: HTMLElement,
) => VimAdapter;

type MonacoVimGlobal = {
  initVimMode?: InitVimMode;
};

type WindowWithDefine = typeof window & { define?: unknown };

function loadMonacoVim(): Promise<InitVimMode | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  const globalWin = window as typeof window & {
    MonacoVim?: MonacoVimGlobal;
  };

  if (globalWin.MonacoVim?.initVimMode) {
    return Promise.resolve(globalWin.MonacoVim.initVimMode);
  }

  return new Promise((resolve) => {
    const w = window as WindowWithDefine;
    const savedDefine = w.define;
    w.define = undefined;

    const restore = () => {
      w.define = savedDefine;
    };

    const script = document.createElement("script");
    script.src = MONACO_VIM_CDN;
    script.onload = () => {
      restore();
      resolve(globalWin.MonacoVim?.initVimMode ?? null);
    };
    script.onerror = () => {
      restore();
      resolve(null);
    };
    document.head.appendChild(script);
  });
}

export type UseVimModeReturn = {
  vimEnabled: boolean;
  toggleVim: () => void;
  editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>;
  statusBarRef: React.RefObject<HTMLDivElement | null>;
  onEditorMount: (editor: editor.IStandaloneCodeEditor) => void;
};

export function useVimMode(): UseVimModeReturn {
  const [vimEnabled, setVimEnabled] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const statusBarRef = useRef<HTMLDivElement | null>(null);
  const vimAdapterRef = useRef<VimAdapter | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(VIM_MODE_STORAGE_KEY);
    setVimEnabled(stored === "true");
  }, []);

  const onEditorMount = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor) => {
      editorRef.current = editorInstance;
      setEditorReady(true);
    },
    [],
  );

  useEffect(() => {
    if (!editorReady) return;
    loadMonacoVim();
  }, [editorReady]);

  const toggleVim = useCallback(() => {
    setVimEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(VIM_MODE_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    if (!vimEnabled && vimAdapterRef.current) {
      vimAdapterRef.current.dispose();
      vimAdapterRef.current = null;
      return;
    }

    const editorInstance = editorRef.current;
    const statusNode = statusBarRef.current;
    if (!editorInstance || !statusNode) return;

    if (vimEnabled && !vimAdapterRef.current) {
      loadMonacoVim().then((initVimMode) => {
        if (!editorRef.current || !statusBarRef.current || !initVimMode) return;
        vimAdapterRef.current = initVimMode(
          editorRef.current,
          statusBarRef.current,
        );
      });
    }
  }, [vimEnabled]);

  useEffect(() => {
    return () => {
      if (vimAdapterRef.current) {
        vimAdapterRef.current.dispose();
        vimAdapterRef.current = null;
      }
    };
  }, []);

  return { vimEnabled, toggleVim, editorRef, statusBarRef, onEditorMount };
}
