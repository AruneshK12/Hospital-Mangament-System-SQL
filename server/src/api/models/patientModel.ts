import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Patient = z.infer<typeof PatientSchema>;
export const PatientSchema = z.object({
  PatientId: z.number(),
  FirstName: z.string(),
  LastName: z.string(),
  DateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  Gender: z.enum(["M", "F"]),
  Address: z.string(),
  Phone: z.number(),
  Email: z.string().email(),
  Password: z.string(),
});

export type MaxId = z.infer<typeof maxIdSchema>;
export const maxIdSchema = z.object({
  maxId: z.number(),
});

export type NewPatient = z.infer<typeof NewPatientSchema>;
export const NewPatientSchema = PatientSchema.omit({ PatientId: true });

// Input Validation for 'GET Patient/:id' endpoint
export const GetPatientSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const UpdatePatientSchema = PatientSchema;

export const DeletePatientSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignIn = z.infer<typeof SignInSchema>;

export const PatientMetricsSchema = z.object({
  PatientId: z.number(),
  FirstName: z.string(),
  LastName: z.string(),
  TotalAppointments: z.number(),
  AppointmentsLeft: z.number(),
  LabReportsPending: z.number(),
});

export type PatientMetrics = z.infer<typeof PatientMetricsSchema>;

export const PatientPaymentHistorySchema = z.object({
  PatientId: z.number(),
  FirstName: z.string(),
  LastName: z.string(),
  TotalBilled: z.number(),
  TotalPaid: z.number(),
});

export type PatientPaymentHistory = z.infer<typeof PatientPaymentHistorySchema>;

export const PaymentHistoryRequestSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
});

export const AppointmentSchema = z.object({
  AppointmentId: z.number(),
  PatientFirstName: z.string(),
  PatientLastName: z.string(),
  DoctorFirstName: z.string(),
  DoctorLastName: z.string(),
  HospitalId: z.number(),
  HospitalName: z.string(),
  AppointmentStatus: z.string(),
  AppointmentTimestamp: z.string(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

export const MakeAppointmentRequestSchema = z.object({
  PatientId: z.number(),
  DoctorId: z.number(),
  Timestamp: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/),
});

export const GetPatientMetricsSchema = z.object({
  query: z.object({
    PatientId: z.number().optional(),
  }),
});

export const TransactionSchema = z.object({
  TransactionId: z.number(),
  Timestamp: z.string(),
  Amount: z.number(),
  Mode: z.string(),
  Type: z.string(),
  HospitalName: z.string().nullable(),
  PatientFirstName: z.string(),
  PatientLastName: z.string(),
});

export const GetTransactionsByPatientSchema = z.object({
  params: z.object({ patientId: z.number() }),
});

export type Transaction = z.infer<typeof TransactionSchema>;
