import { KEYWORDS, TYPES } from "./token-sets";

export const TOKEN_RE =
  /(\/\/[^\n]*)|(`[^`]*`|"[^"]*"|'[^']*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][A-Za-z0-9_$]*)|([{}()[\];:,.<>=+\-*/&|!?])/g;

export function classFor(word: string): string {
  if (KEYWORDS.has(word)) return "text-syntax-keyword";
  if (TYPES.has(word)) return "text-syntax-type";
  if (/^[A-Z]/.test(word)) return "text-syntax-type";
  return "text-on-dark";
}
