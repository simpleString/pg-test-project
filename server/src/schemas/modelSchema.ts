import { z } from "zod";

export const modelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  context_length: z.number(),
  tokenizer: z.string(),
  modality: z.string(),
});
