import { evaluatorV1Prompt } from "./evaluator.v1.prompt";
import { evaluatorV2Prompt } from "./evaluator.v2.prompt";
import type { PromptVersion } from "./prompt-version";

export { EVALUATOR_PROMPT_V1_ID } from "./evaluator.v1.prompt";
export { EVALUATOR_PROMPT_V2_ID } from "./evaluator.v2.prompt";

export const PROMPT_VERSIONS: Readonly<Record<string, PromptVersion>> = {
  [evaluatorV1Prompt.id]: evaluatorV1Prompt,
  [evaluatorV2Prompt.id]: evaluatorV2Prompt,
};

export const DEFAULT_PROMPT_VERSION_ID = evaluatorV1Prompt.id;

export function getPromptVersion(id: string): PromptVersion {
  const version = PROMPT_VERSIONS[id];

  if (!version) {
    throw new Error(
      `Unknown prompt version "${id}". Available versions: ${Object.keys(
        PROMPT_VERSIONS,
      ).join(", ")}`,
    );
  }

  return version;
}
