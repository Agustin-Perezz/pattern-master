import type { Evaluation } from "@/domain/entities/evaluation.schema";

export type EvaluationTelemetry = {
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  model: string;
  schemaValid: boolean;
};

export type EvaluateWithTelemetryResult = {
  evaluation: Evaluation | null;
  telemetry: EvaluationTelemetry;
};

export class EvaluationSchemaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvaluationSchemaError";
  }
}
