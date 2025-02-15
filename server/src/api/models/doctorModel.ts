import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Doctor = z.infer<typeof DoctorSchema>;
export const DoctorSchema = z.object({
  DoctorId: z.number(),
  FirstName: z.string(),
  LastName: z.string(),
  Gender: z.enum(["M", "F"]),
  Rating: z.number().min(0).max(5),
  Price: z.number(),
  Phone: z.string().regex(/^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/),
  Email: z.string().email(),
  HospitalId: z.number(),
  Password: z.string(),
});

// Input Validation for 'GET Doctor/:id' endpoint
export const GetDoctorSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Input Validation for 'GET Doctors by HospitalId' endpoint
export const GetDoctorsByHospitalSchema = z.object({
  params: z.object({ hospitalId: commonValidations.id }),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignIn = z.infer<typeof SignInSchema>;

export const UpdateDoctorSchema = DoctorSchema;

export const PaginationSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
});

export const FindAllWithPagination = z.object({
  doctors: z.array(DoctorSchema),
  totalRows: z.number(),
});
export type FindAllWithPaginationSchema = z.infer<typeof FindAllWithPagination>;

export const AddAvailabilitySchema = z.object({
  doctorId: z.number(),
  startDate: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  endDate: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

export const AppointmentsCompletedTodaySchema = z.object({
  AppointmentsCompletedToday: z.number(),
});

export const AppointmentsPendingTodaySchema = z.object({
  AppointmentsPendingToday: z.number(),
});

export const LabReportPendingSchema = z.object({
  OrderId: z.number(),
  AppointmentId: z.number(),
  DoctorId: z.number(),
  DoctorName: z.string(),
  PatientId: z.number(),
  PatientName: z.string(),
  LabTestId: z.number(),
  LabTestName: z.string(),
  Description: z.string(),
  OptimalRange: z.string(),
  Price: z.number(),
  OrderedTimestamp: z.string(),
});

export type LabReportPending = z.infer<typeof LabReportPendingSchema>;

export const CancelAppointmentSchema = z.object({
  appointmentId: z.number(),
});

export const AppointmentsSummarySchema = z.object({
  AppointmentsCompletedToday: z.number(),
  AppointmentsPendingToday: z.number(),
  PendingLabReports: z.number(),
});

export type AppointmentsSummary = z.infer<typeof AppointmentsSummarySchema>;
