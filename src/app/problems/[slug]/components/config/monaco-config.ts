// Monaco Editor configuration for the challenge editor.
// VS Code Dark+ syntax palette on the app's terminal-dark background.

export const MONACO_THEME = "opencode-dark";

export const EDITOR_FONT_FAMILY =
  '"Berkeley Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';

export const EDITOR_FONT_SIZE = 14;

export const EDITOR_MODEL_PATH = "file:///challenge.ts";

export const MONACO_THEME_DEFINITION = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "comment", foreground: "6A9955", fontStyle: "italic" },
    { token: "keyword", foreground: "569CD6" },
    { token: "keyword.control", foreground: "C586C0" },
    { token: "keyword.operator", foreground: "D4D4D4" },
    { token: "string", foreground: "CE9178" },
    { token: "string.escape", foreground: "D7BA7D" },
    { token: "number", foreground: "B5CEA8" },
    { token: "type", foreground: "4EC9B0" },
    { token: "type.identifier", foreground: "4EC9B0" },
    { token: "class", foreground: "4EC9B0" },
    { token: "interface", foreground: "B5CEA8" },
    { token: "function", foreground: "DCDCAA" },
    { token: "identifier", foreground: "9CDCFE" },
    { token: "variable", foreground: "9CDCFE" },
    { token: "variable.predefined", foreground: "569CD6" },
    { token: "delimiter", foreground: "D4D4D4" },
    { token: "delimiter.parenthesis", foreground: "D4D4D4" },
    { token: "delimiter.square", foreground: "D4D4D4" },
    { token: "tag", foreground: "569CD6" },
    { token: "attribute.name", foreground: "9CDCFE" },
    { token: "attribute.value", foreground: "CE9178" },
  ],
  colors: {
    "editor.background": "#201d1d",
    "editor.foreground": "#D4D4D4",
    "editorLineNumber.foreground": "#858585",
    "editorLineNumber.activeForeground": "#C6C6C6",
    "editor.selectionBackground": "#264F78",
    "editor.lineHighlightBackground": "#2a2626",
    "editorCursor.foreground": "#AEAFAD",
    "editorWhitespace.foreground": "rgba(212,212,212,0.08)",
    "editorIndentGuide.background": "rgba(212,212,212,0.08)",
    "editorIndentGuide.activeBackground": "rgba(212,212,212,0.15)",
    "editorGutter.background": "#201d1d",
    "editorWidget.background": "#262222",
    "editorWidget.border": "#454545",
    "editorSuggestWidget.background": "#252526",
    "editorSuggestWidget.selectedBackground": "#094771",
    "scrollbarSlider.background": "rgba(212,212,212,0.08)",
    "scrollbarSlider.hoverBackground": "rgba(212,212,212,0.15)",
    "editorOverviewRuler.border": "#201d1d",
    "editorOverviewRuler.background": "#201d1d",
    "editorMarkerNavigationError.background": "#454545",
    "editorMarkerNavigationWarning.background": "#454545",
  },
};

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
