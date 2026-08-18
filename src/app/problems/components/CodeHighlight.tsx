import * as React from "react";

import { classFor, TOKEN_RE } from "./syntax-tokens";

function tokenize(line: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  let i = 0;

  for (
    match = TOKEN_RE.exec(line);
    match !== null;
    match = TOKEN_RE.exec(line)
  ) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }
    const [full, comment, str, num, word, punct] = match;
    let className = "";
    if (comment) className = "text-syntax-comment italic";
    else if (str) className = "text-syntax-string";
    else if (num) className = "text-syntax-number";
    else if (word) className = classFor(word);
    else if (punct) className = "text-syntax-punct";

    nodes.push(
      <span key={`${keyPrefix}-${i}`} className={className}>
        {full}
      </span>,
    );
    lastIndex = match.index + full.length;
    i += 1;
  }
  if (lastIndex < line.length) nodes.push(line.slice(lastIndex));
  return nodes;
}

export function highlight(code: string): React.ReactNode[] {
  return code.split("\n").map((line, lineNumber) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: line order is fixed for a static code string
    <React.Fragment key={lineNumber}>
      {line.length ? tokenize(line, String(lineNumber)) : "\u00A0"}
      {"\n"}
    </React.Fragment>
  ));
}
