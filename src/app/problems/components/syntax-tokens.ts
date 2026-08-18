const KEYWORDS = new Set([
  "interface",
  "class",
  "implements",
  "extends",
  "constructor",
  "private",
  "public",
  "protected",
  "readonly",
  "return",
  "switch",
  "case",
  "break",
  "new",
  "const",
  "let",
  "var",
  "function",
  "import",
  "export",
  "from",
  "default",
  "this",
  "void",
  "if",
  "else",
  "for",
  "while",
]);

const TYPES = new Set([
  "number",
  "string",
  "boolean",
  "void",
  "any",
  "unknown",
  "never",
]);

const TOKEN_RE =
  /(\/\/[^\n]*)|(`[^`]*`|"[^"]*"|'[^']*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][A-Za-z0-9_$]*)|([{}()[\];:,.<>=+\-*/&|!?])/g;

export function classFor(word: string): string {
  if (KEYWORDS.has(word)) return "text-syntax-keyword";
  if (TYPES.has(word)) return "text-syntax-type";
  if (/^[A-Z]/.test(word)) return "text-syntax-type";
  return "text-on-dark";
}

export { TOKEN_RE };
