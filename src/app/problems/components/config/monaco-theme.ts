// Monaco theme definition for the challenge editor.
// VS Code Dark+ syntax palette on the app's terminal-dark background.

import { MONACO_THEME_COLORS } from "./monaco-theme-colors";
import { MONACO_THEME_RULES } from "./monaco-theme-rules";

export const MONACO_THEME_DEFINITION = {
  base: "vs-dark" as const,
  inherit: true,
  rules: MONACO_THEME_RULES,
  colors: MONACO_THEME_COLORS,
};
