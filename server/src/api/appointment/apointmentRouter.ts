import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { appointmentController } from "./apointmentController";
import {
  AppointmentSchema,
  AvailableAppointmentSchema,
  GroupedAvailableAppointmentsSchema,
} from "@/api/models/apointmentModel";

export const apointmentRegistry = new OpenAPIRegistry();
export const apointmentRouter: Router = express.Router();

apointmentRouter.get(
  "/patient/:patientId",
  appointmentController.getAppointmentsByPatientId
);

apointmentRouter.get(
  "/doctor/:doctorId",
  appointmentController.getAppointmentsByDoctorId
);

apointmentRouter.get(
  "/doctor/:doctorId/available",
  appointmentController.getAvailableAppointmentsByDoctorIdAndDate
);

apointmentRouter.get(
  "/hospital/:hospitalId/available",
  appointmentController.getGroupedAvailableAppointmentsByHospitalIdAndDate
);

apointmentRegistry.registerPath({
  method: "get",
  path: "/appointments/patient/{patientId}",
  tags: ["Appointment"],
  request: {
    params: z.object({
      patientId: z.number(),
    }),
  },
  responses: createApiResponse(z.array(AppointmentSchema), "Success"),
});

apointmentRegistry.registerPath({
  method: "get",
  path: "/appointments/doctor/{doctorId}",
  tags: ["Appointment"],
  request: {
    params: z.object({
      doctorId: z.number(),
    }),
  },
  responses: createApiResponse(z.array(AppointmentSchema), "Success"),
});

apointmentRegistry.registerPath({
  method: "get",
  path: "/appointments/doctor/{doctorId}/available",
  tags: ["Appointment"],
  request: {
    params: z.object({
      doctorId: z.number(),
    }),
    query: z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
    }),
  },
  responses: createApiResponse(z.array(AvailableAppointmentSchema), "Success"),
});

apointmentRegistry.registerPath({
  method: "get",
  path: "/appointments/hospital/{hospitalId}/available",
  tags: ["Appointment"],
  request: {
    params: z.object({
      hospitalId: z.number(),
    }),
    query: z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
    }),
  },
  responses: createApiResponse(GroupedAvailableAppointmentsSchema, "Success"),
});
