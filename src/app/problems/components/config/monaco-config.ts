// Monaco Editor configuration for the challenge editor.

export { MONACO_THEME_DEFINITION } from "./monaco-theme";

export const MONACO_THEME = "opencode-dark";

export const EDITOR_FONT_FAMILY =
  '"Berkeley Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';

export const EDITOR_FONT_SIZE = 14;

export const EDITOR_MODEL_PATH = "file:///challenge.ts";

export const EDITOR_OPTIONS = {
  fontFamily: EDITOR_FONT_FAMILY,
  fontSize: EDITOR_FONT_SIZE,
  fontLigatures: true,
  wordWrap: "on" as const,
  minimap: { enabled: false },
  bracketPairColorization: { enabled: true },
  cursorBlinking: "solid" as const,
  formatOnPaste: true,
  scrollBeyondLastLine: false,
  smoothScrolling: true,
};
