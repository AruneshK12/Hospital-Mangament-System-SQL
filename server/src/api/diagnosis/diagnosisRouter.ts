import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { DiagnosisSchema } from "@/api/models/diagnosisModel";
import { diagnosisController } from "./diagnosisController";

export const diagnosisRegistry = new OpenAPIRegistry();
export const diagnosisRouter: Router = express.Router();

diagnosisRegistry.register("Diagnosis", DiagnosisSchema);

diagnosisRegistry.registerPath({
  method: "post",
  path: "/diagnosis",
  tags: ["Diagnosis"],
  request: {
    body: {
      content: {
        "application/json": { schema: DiagnosisSchema },
      },
    },
  },
  responses: createApiResponse(z.object({}), "Diagnosis handled successfully"),
});

diagnosisRouter.post("/", diagnosisController.handleDiagnosis);
