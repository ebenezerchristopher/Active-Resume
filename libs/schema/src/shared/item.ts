import { z } from "zod/v3";

import { idSchema } from "./id";

// Schema
export const itemSchema = z.object({
  id: idSchema,
  visible: z.boolean(),
});

// Type
export type Item = z.infer<typeof itemSchema>;

// Defaults
export const defaultItem: Item = {
  id: "",
  visible: true,
};
