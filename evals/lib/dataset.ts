import rawDataset from "../dataset.json";
import type { Dataset } from "./dataset.schema";
import { datasetSchema } from "./dataset.schema";

export const dataset: Dataset = datasetSchema.parse(rawDataset);
