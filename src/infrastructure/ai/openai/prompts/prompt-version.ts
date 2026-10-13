export type BuildPrompt = (
  code: string,
  challengeSlug: string,
  targetPattern: string,
) => string;

export type PromptVersion = {
  id: string;
  system: string;
  buildPrompt: BuildPrompt;
};
