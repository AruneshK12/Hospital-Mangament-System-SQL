import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const DiagnosisSchema = z.object({
  AppointmentId: z.number(),
  PatientId: z.number(),
  DoctorId: z.number(),
  MedicineId: z.number(),
  LabTestId: z.number(),
});

export type Diagnosis = z.infer<typeof DiagnosisSchema>;

export const PrescriptionDetailsSchema = z.object({
  AppointmentId: z.number().nullable(),
  DoctorId: z.number().nullable(),
  MedicineId: z.number().nullable(),
  Timestamp: z.date().nullable(),
});

export type PrescriptionDetails = z.infer<typeof PrescriptionDetailsSchema>;

export const OrderDetailsSchema = z.object({
  DoctorId: z.number().nullable(),
  LabTestId: z.number().nullable(),
  AppointmentId: z.number().nullable(),
  Timestamp: z.date().nullable(),
});

export type OrderDetails = z.infer<typeof OrderDetailsSchema>;
