import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const MedicineSchema = z.object({
  MedicineId: z.number(),
  MedicineName: z.string(),
  Dosage: z.string(),
  Manufacturer: z.string(),
  Price: z.number().min(0),
});

export const SearchMedicineSchema = z.object({
  query: z.object({
    searchString: z.string(),
  }),
});

export type Medicine = z.infer<typeof MedicineSchema>;
