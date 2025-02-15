import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  AppointmentSchema,
  DeletePatientSchema,
  GetPatientMetricsSchema,
  GetPatientSchema,
  GetTransactionsByPatientSchema,
  MakeAppointmentRequestSchema,
  NewPatientSchema,
  PatientMetricsSchema,
  PatientPaymentHistorySchema,
  PatientSchema,
  PaymentHistoryRequestSchema,
  SignInSchema,
  TransactionSchema,
  UpdatePatientSchema,
} from "@/api/models/patientModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { patientController } from "./patientController";

export const patientRegistry = new OpenAPIRegistry();
export const patientRouter: Router = express.Router();

patientRegistry.register("Patient", PatientSchema);

patientRegistry.registerPath({
  method: "get",
  path: "/patients",
  tags: ["Patient"],
  responses: createApiResponse(z.array(PatientSchema), "Success"),
});

patientRouter.get("/", patientController.getPatients);

patientRegistry.registerPath({
  method: "get",
  path: "/patients/metrics",
  tags: ["Patient"],
  request: { query: GetPatientMetricsSchema.shape.query },
  responses: createApiResponse(z.array(PatientMetricsSchema), "Success"),
});

patientRouter.get("/metrics", patientController.getPatientMetrics);

patientRegistry.registerPath({
  method: "get",
  path: "/patients/{id}",
  tags: ["Patient"],
  request: { params: GetPatientSchema.shape.params },
  responses: createApiResponse(PatientSchema, "Success"),
});

patientRouter.get(
  "/:id",
  validateRequest(GetPatientSchema),
  patientController.getPatient
);

patientRegistry.registerPath({
  method: "post",
  path: "/patients/add",
  tags: ["Patient"],
  request: {
    body: {
      content: {
        "application/json": { schema: NewPatientSchema },
      },
    },
  },
  responses: createApiResponse(PatientSchema, "Created"),
});

patientRouter.post("/add", patientController.addPatient);

patientRegistry.registerPath({
  method: "put",
  path: "/patients/update",
  tags: ["Patient"],
  request: {
    body: {
      content: {
        "application/json": { schema: UpdatePatientSchema },
      },
    },
  },
  responses: createApiResponse(PatientSchema, "Updated"),
});

patientRouter.put("/update", patientController.updatePatient);

patientRegistry.registerPath({
  method: "delete",
  path: "/patients/{id}",
  tags: ["Patient"],
  request: { params: DeletePatientSchema.shape.params },
  responses: createApiResponse(z.object({ message: z.string() }), "Deleted"),
});

patientRouter.delete(
  "/:id",
  validateRequest(DeletePatientSchema),
  patientController.deletePatient
);

patientRegistry.registerPath({
  method: "get",
  path: "/patients/{patientId}/transactions",
  tags: ["Patient"],
  request: { params: GetTransactionsByPatientSchema.shape.params },
  responses: createApiResponse(z.array(TransactionSchema), "Success"),
});

patientRouter.get(
  "/:patientId/transactions",
  // validateRequest(GetTransactionsByPatientSchema),
  patientController.getTransactionsByPatientId
);

patientRegistry.registerPath({
  method: "post",
  path: "/patients/payment-history",
  tags: ["Patient"],
  request: {
    body: {
      content: {
        "application/json": { schema: PaymentHistoryRequestSchema },
      },
    },
  },
  responses: createApiResponse(z.array(PatientPaymentHistorySchema), "Success"),
});

patientRouter.post(
  "/payment-history",
  patientController.getPatientPaymentHistory
);

patientRouter.post("/make-appointment", patientController.makeAppointment);

patientRegistry.registerPath({
  method: "post",
  path: "/patients/make-appointment",
  tags: ["Patient"],
  request: {
    body: {
      content: {
        "application/json": { schema: MakeAppointmentRequestSchema },
      },
    },
  },
  responses: createApiResponse(AppointmentSchema, "Success"),
});

patientRegistry.registerPath({
  method: "put",
  path: "/patients/appointment/modify",
  tags: ["Patient"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            PatientId: z.number(),
            DoctorId: z.number(),
            AppointmentId: z.number(),
            NewTimestamp: z
              .string()
              .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/),
          }),
        },
      },
    },
  },
  responses: createApiResponse(AppointmentSchema, "Updated"),
});

patientRouter.put("/appointment/modify", patientController.modifyAppointment);

patientRegistry.registerPath({
  method: "delete",
  path: "/patients/appointment/{appointmentId}",
  tags: ["Patient"],
  request: { params: z.object({ appointmentId: z.number() }) },
  responses: createApiResponse(z.object({ message: z.string() }), "Deleted"),
});

patientRouter.delete(
  "/appointment/:appointmentId",
  patientController.cancelAppointment
);
