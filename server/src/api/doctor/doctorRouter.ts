import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  GetDoctorSchema,
  GetDoctorsByHospitalSchema,
  DoctorSchema,
  PaginationSchema,
  FindAllWithPagination,
  SignInSchema,
  UpdateDoctorSchema,
  AddAvailabilitySchema,
  LabReportPendingSchema,
  AppointmentsSummarySchema,
} from "@/api/models/doctorModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { doctorController } from "./doctorController";

export const doctorRegistry = new OpenAPIRegistry();
export const doctorRouter: Router = express.Router();

doctorRegistry.register("Doctor", DoctorSchema);

doctorRegistry.registerPath({
  method: "get",
  path: "/doctors",
  tags: ["Doctor"],
  request: { query: PaginationSchema },
  responses: createApiResponse(FindAllWithPagination, "Success"),
});

doctorRouter.get(
  "/",
  // validateRequest({ PaginationSchema }),
  doctorController.getDoctors
);

doctorRegistry.registerPath({
  method: "get",
  path: "/doctors/{id}",
  tags: ["Doctor"],
  request: { params: GetDoctorSchema.shape.params },
  responses: createApiResponse(DoctorSchema, "Success"),
});

doctorRouter.get(
  "/:id",
  validateRequest(GetDoctorSchema),
  doctorController.getDoctor
);

doctorRegistry.registerPath({
  method: "get",
  path: "/doctors/hospital/{hospitalId}",
  tags: ["Doctor"],
  request: { params: GetDoctorsByHospitalSchema.shape.params },
  responses: createApiResponse(z.array(DoctorSchema), "Success"),
});

doctorRouter.get(
  "/hospital/:hospitalId",
  validateRequest(GetDoctorsByHospitalSchema),
  doctorController.getDoctorsByHospitalId
);

doctorRegistry.registerPath({
  method: "put",
  path: "/doctors/update",
  tags: ["Doctor"],
  request: {
    body: {
      content: {
        "application/json": { schema: UpdateDoctorSchema },
      },
    },
  },
  responses: createApiResponse(DoctorSchema, "Updated"),
});

doctorRouter.put("/update", doctorController.updateDoctor);

doctorRegistry.registerPath({
  method: "post",
  path: "/doctors/sign-in",
  tags: ["Doctor"],
  request: {
    body: {
      content: {
        "application/json": { schema: SignInSchema },
      },
    },
  },
  responses: createApiResponse(DoctorSchema, "Success"),
});

doctorRouter.post(
  "/sign-in",
  // validateRequest({ body: SignInSchema }),
  doctorController.signIn
);

doctorRegistry.registerPath({
  method: "post",
  path: "/doctors/add-availability",
  tags: ["Doctor"],
  request: {
    body: {
      content: {
        "application/json": { schema: AddAvailabilitySchema },
      },
    },
  },
  responses: createApiResponse(z.null(), "Success"),
});

doctorRouter.post("/add-availability", doctorController.addAvailability);

doctorRegistry.registerPath({
  method: "delete",
  path: "/doctors/appointment/{appointmentId}",
  tags: ["Doctor"],
  request: { params: z.object({ appointmentId: z.number() }) },
  responses: createApiResponse(z.object({ message: z.string() }), "Deleted"),
});

doctorRouter.delete(
  "/appointment/:appointmentId",
  doctorController.cancelAppointment
);

doctorRegistry.registerPath({
  method: "get",
  path: "/doctors/{doctorId}/appointments-summary",
  tags: ["Doctor"],
  request: { params: z.object({ doctorId: z.number() }) },
  responses: createApiResponse(AppointmentsSummarySchema, "Success"),
});

doctorRouter.get(
  "/:doctorId/appointments-summary",
  doctorController.getAppointmentsSummary
);

doctorRegistry.registerPath({
  method: "get",
  path: "/doctors/{doctorId}/lab-reports-pending",
  tags: ["Doctor"],
  request: { params: z.object({ doctorId: z.number() }) },
  responses: createApiResponse(z.array(LabReportPendingSchema), "Success"),
});

doctorRouter.get(
  "/:doctorId/lab-reports-pending",
  doctorController.getLabReportsPending
);
