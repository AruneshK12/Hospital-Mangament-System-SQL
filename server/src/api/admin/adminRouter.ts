import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  AverageDoctorsRatingPerHospitalQueryResultSchema,
  PatientsByDoctorRatingQueryResultSchema,
  PatientsByTopQualifiedDoctorsSchema,
  FrequentCustomersSchema,
  PatientCoordinateCountSchema,
  TotalAppointmentsTodaySchema,
  TotalDoctorsSchema,
  TotalHospitalsSchema,
  CombinedStatsSchema,
} from "@/api/models/adminModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { adminController } from "./adminController";

export const adminRegistry = new OpenAPIRegistry();
export const adminRouter: Router = express.Router();

adminRegistry.registerPath({
  method: "get",
  path: "/admin/patients-by-doctor-rating",
  tags: ["Admin"],
  request: {
    query: z.object({
      rating: z.number().min(0).max(5),
    }),
  },
  responses: createApiResponse(
    z.array(PatientsByDoctorRatingQueryResultSchema),
    "Success"
  ),
});

adminRouter.get(
  "/patients-by-doctor-rating",
  adminController.getPatientsByTopQualifiedDoctors
);

const AdminAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

adminRegistry.registerPath({
  method: "post",
  path: "/admin/register",
  tags: ["Admin"],
  request: {
    body: {
      content: {
        "application/json": { schema: AdminAuthSchema },
      },
    },
  },
  responses: createApiResponse(z.object({}), "Admin registered"),
});

adminRouter.post(
  "/register",
  // validateRequest({ body: AdminAuthSchema }),
  adminController.registerAdmin
);

adminRegistry.registerPath({
  method: "get",
  path: "/admin/doctors-count-per-hospital",
  tags: ["Admin"],
  responses: createApiResponse(
    z.array(AverageDoctorsRatingPerHospitalQueryResultSchema),
    "Success"
  ),
});

adminRouter.get(
  "/doctors-count-per-hospital",
  adminController.getDoctorsCountPerHospital
);

adminRegistry.registerPath({
  method: "get",
  path: "/admin/patients-by-top-qualified-doctors",
  tags: ["Admin"],
  request: {
    query: z.object({
      rating: z.number().min(0).max(5),
    }),
  },
  responses: createApiResponse(
    z.array(PatientsByTopQualifiedDoctorsSchema),
    "Success"
  ),
});

adminRouter.get(
  "/patients-by-top-qualified-doctors",
  adminController.getPatientsByDoctorRating
);

// Registering the login route
adminRegistry.registerPath({
  method: "post",
  path: "/admin/login",
  tags: ["Admin"],
  request: {
    body: {
      content: {
        "application/json": { schema: AdminAuthSchema },
      },
    },
  },
  responses: createApiResponse(z.object({}), "Login successful"),
});

adminRouter.post(
  "/login",
  // validateRequest({ body: AdminAuthSchema }),
  adminController.loginAdmin
);

adminRegistry.registerPath({
  method: "get",
  path: "/admin/frequent-customers",
  tags: ["Admin"],
  responses: createApiResponse(z.array(FrequentCustomersSchema), "Success"),
});

adminRouter.get("/frequent-customers", adminController.getFrequentCustomers);

// New route for patient coordinate counts
adminRegistry.registerPath({
  method: "post",
  path: "/admin/patient-coordinate-counts",
  tags: ["Admin"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            startTime: z.string(),
            endTime: z.string(),
            allergyPattern: z.string(),
          }),
        },
      },
    },
  },
  responses: createApiResponse(
    z.array(PatientCoordinateCountSchema),
    "Success"
  ),
});

adminRouter.post(
  "/patient-coordinate-counts",
  adminController.getPatientCoordinateCounts
);

// adminRegistry.registerPath({
//   method: "get",
//   path: "/admin/total-appointments-today",
//   tags: ["Admin"],
//   responses: createApiResponse(TotalAppointmentsTodaySchema, "Success"),
// });

// adminRouter.get(
//   "/total-appointments-today",
//   adminController.getTotalAppointmentsToday
// );

// adminRegistry.registerPath({
//   method: "get",
//   path: "/admin/total-doctors",
//   tags: ["Admin"],
//   responses: createApiResponse(TotalDoctorsSchema, "Success"),
// });

// adminRouter.get("/total-doctors", adminController.getTotalDoctors);

// adminRegistry.registerPath({
//   method: "get",
//   path: "/admin/total-hospitals",
//   tags: ["Admin"],
//   responses: createApiResponse(TotalHospitalsSchema, "Success"),
// });

// adminRouter.get("/total-hospitals", adminController.getTotalHospitals);

adminRegistry.registerPath({
  method: "get",
  path: "/admin/combined-stats",
  tags: ["Admin"],
  responses: createApiResponse(CombinedStatsSchema, "Success"),
});

adminRouter.get("/combined-stats", adminController.getCombinedStats);
