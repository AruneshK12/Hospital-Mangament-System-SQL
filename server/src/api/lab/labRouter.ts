import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  LabTestSchema,
  LabTestWithReportSchema,
  GetLabTestsByDoctorSchema,
  GetLabTestsByPatientSchema,
  PaginationSchema,
  FindAllWithPagination,
} from "../models/labModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { labController } from "./labController";

export const labRegistry = new OpenAPIRegistry();
export const labRouter: Router = express.Router();

labRegistry.register("LabTest", LabTestSchema);

labRegistry.registerPath({
  method: "get",
  path: "/lab-tests",
  tags: ["LabTest"],
  request: { query: PaginationSchema },
  responses: createApiResponse(FindAllWithPagination, "Success"),
});

labRouter.get("/", labController.getLabTests);

labRegistry.registerPath({
  method: "get",
  path: "/lab-tests/doctor/{doctorId}",
  tags: ["LabTest"],
  request: { params: GetLabTestsByDoctorSchema.shape.params },
  responses: createApiResponse(z.array(LabTestSchema), "Success"),
});

labRouter.get(
  "/doctor/:doctorId",
  //   validateRequest(GetLabTestsByDoctorSchema),
  labController.getLabTestsByDoctorId
);

labRegistry.registerPath({
  method: "get",
  path: "/lab-tests/patient/{patientId}",
  tags: ["LabTest"],
  request: { params: GetLabTestsByPatientSchema.shape.params },
  responses: createApiResponse(z.array(LabTestWithReportSchema), "Success"),
});

labRouter.get(
  "/patient/:patientId",
  //   validateRequest(GetLabTestsByPatientSchema),
  labController.getLabTestsByPatientId
);
