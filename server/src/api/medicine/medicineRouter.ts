import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { medicineController } from "./medicineController";
import { MedicineSchema, SearchMedicineSchema } from "../models/medicineModel";

export const medicineRegistry = new OpenAPIRegistry();
export const medicineRouter: Router = express.Router();

medicineRegistry.register("Medicine", MedicineSchema);

medicineRegistry.registerPath({
  method: "get",
  path: "/medicines/search",
  tags: ["Medicine"],
  request: { query: SearchMedicineSchema.shape.query },
  responses: createApiResponse(z.array(MedicineSchema), "Success"),
});

medicineRouter.get(
  "/search",
  validateRequest(SearchMedicineSchema),
  medicineController.searchMedicines
);
