import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  GetHospitalSchema,
  GetTransactionsByHospitalSchema,
  HospitalSchema,
  PaginationSchema,
  TransactionSchema,
} from "@/api/models/hospitalModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { hospitalController } from "./hospitalController";

export const hospitalRegistry = new OpenAPIRegistry();
export const hospitalRouter: Router = express.Router();

hospitalRegistry.register("Hospital", HospitalSchema);

hospitalRegistry.registerPath({
  method: "get",
  path: "/hospitals",
  tags: ["Hospital"],
  request: { query: PaginationSchema },
  responses: createApiResponse(GetHospitalSchema, "Success"),
});

hospitalRouter.get("/", hospitalController.getHospitals);

hospitalRegistry.registerPath({
  method: "get",
  path: "/hospitals/{id}",
  tags: ["Hospital"],
  request: { params: GetHospitalSchema.shape.params },
  responses: createApiResponse(HospitalSchema, "Success"),
});

hospitalRouter.get(
  "/:id",
  validateRequest(GetHospitalSchema),
  hospitalController.getHospital
);

hospitalRegistry.registerPath({
  method: "get",
  path: "/hospitals/{hospitalId}/transactions",
  tags: ["Hospital"],
  request: { params: GetTransactionsByHospitalSchema.shape.params },
  responses: createApiResponse(z.array(TransactionSchema), "Success"),
});

hospitalRouter.get(
  "/:hospitalId/transactions",
  hospitalController.getTransactionsByHospitalId
);
