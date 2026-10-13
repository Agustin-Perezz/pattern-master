# Evaluator Evals Harness

The `evals/` harness is a promptfoo hybrid. It tests the real production evaluator (`OpenaiEvaluateSubmissionRepository`) and the real prompt modules. It never tests a parallel copy. The harness lives outside `src/`, so it is not part of the application runtime.

## Why the prompts stay in TypeScript

The prompts stay as TypeScript modules in `src/infrastructure/ai/openai/prompts/`. promptfoo does not own the prompt text. It only supplies the version id through the `prompts` axis. The provider resolves the real `PromptVersion` module. This keeps one source of truth, so there is no second copy.

## Run an eval

`pnpm eval` runs all prompt versions with 5 repeats per case. `EVAL_REPEAT` overrides the repeat count. `pnpm eval:smoke` runs 1 test × 2 prompts × 1 repeat as a pipeline check.

```bash
pnpm eval                # all versions, 5 repeats per case
EVAL_REPEAT=1 pnpm eval  # one repeat per case (faster)
pnpm eval:smoke          # 1 test × 2 prompts × 1 repeat
```

## See the results

- **Terminal table.** `pnpm eval` prints a comparison table. Re-render an old run with `tsx evals/lib/postprocess.ts evals/results/latest.json`.
- **Web UI.** `pnpm eval:view` serves the grid on port `15500`.
- **Raw output.** `evals/results/latest.json` holds the promptfoo JSON for each run.

## Metrics

The per-case score is the mean of the schema-valid runs for that case. The definitions live in `evals/lib/metrics.ts`.

| Metric | Definition |
| ------ | ---------- |
| Accuracy (in range) | Fraction of cases whose mean score is inside the `expectedScoreRange`, inclusive. A case with no schema-valid run is out of range. |
| MAE (points) | Mean distance from the nearest range bound, over cases with at least one valid score. |
| Avg std dev (points) | Mean of the per-case population standard deviation over runs. A high value means a non-deterministic rubric. |
| Schema valid | Fraction of all runs that returned a valid evaluation. |
| p95 latency (ms) | 95th percentile of run latency, by linear interpolation. |
| Cost per eval (USD) | Mean cost per run. |

## Add a prompt version

1. Create `src/infrastructure/ai/openai/prompts/evaluator.v3.prompt.ts`. It must export a `PromptVersion`.
2. Register it in `src/infrastructure/ai/openai/prompts/evaluator-prompts.ts` under `PROMPT_VERSIONS`.
3. Run `pnpm eval:smoke` as a pipeline check. Then run a full eval.

Nothing else changes. The config derives the prompt axis from `PROMPT_VERSIONS`, and the provider resolves the version by id.

## Caveats

- **Paid calls.** `pnpm eval` makes live OpenAI calls. The default full grid is 360 calls (`2 versions × 36 cases × 5 repeats`) and costs about 0.05 USD. Use `EVAL_REPEAT=1` while you iterate.
- **No dependency.** promptfoo runs through `npx` at a pinned version. It is not a dependency of the project.
- **Labels are not truth.** The golden-set labels come from one model. They measure agreement with that model, not ground truth.
