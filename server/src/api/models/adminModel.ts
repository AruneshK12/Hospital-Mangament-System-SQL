import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
extendZodWithOpenApi(z);

export const PatientsByDoctorRatingQueryResultSchema = z.object({
  FirstName: z.string(),
  LastName: z.string(),
  Gender: z.enum(["M", "F"]),
  Email: z.string().email(),
  Phone: z.string(),
});

export type PatientsByDoctorRatingQueryResult = z.infer<
  typeof PatientsByDoctorRatingQueryResultSchema
>;

export type AdminLogin = z.infer<typeof AdminLoginSchema>;
export const AdminLoginSchema = z.object({
  Email: z.string().email(),
  Password: z.string().min(8),
});

export const AverageDoctorsRatingPerHospitalQueryResultSchema = z.object({
  HospitalName: z.string(),
  DocCount: z.number(),
  AverageHospitalRating: z.number(),
});

export type AverageDoctorsRatingPerHospitalQueryResult = z.infer<
  typeof AverageDoctorsRatingPerHospitalQueryResultSchema
>;

export const PatientsByTopQualifiedDoctorsSchema = z.object({
  FirstName: z.string(),
  LastName: z.string(),
  Gender: z.enum(["M", "F"]),
  Email: z.string().email(),
  Phone: z.string(),
});

export type PatientsByTopQualifiedDoctors = z.infer<
  typeof PatientsByTopQualifiedDoctorsSchema
>;

export const FrequentCustomersSchema = z.object({
  FirstName: z.string(),
  LastName: z.string(),
  Gender: z.enum(["M", "F"]),
  NumberOfBookings: z.number(),
});

export type FrequentCustomers = z.infer<typeof FrequentCustomersSchema>;

export const PatientCoordinateCountSchema = z.object({
  xCordinate: z.number(),
  yCordinate: z.number(),
  patient_count: z.number(),
});

export type PatientCoordinateCount = z.infer<typeof PatientCoordinateCountSchema>;

export const TotalAppointmentsTodaySchema = z.object({
  TotalAppointmentsToday: z.number(),
});

export type TotalAppointmentsToday = z.infer<typeof TotalAppointmentsTodaySchema>;

export const TotalDoctorsSchema = z.object({
  TotalDoctors: z.number(),
});

export type TotalDoctors = z.infer<typeof TotalDoctorsSchema>;

export const TotalHospitalsSchema = z.object({
  TotalHospitals: z.number(),
});

export type TotalHospitals = z.infer<typeof TotalHospitalsSchema>;

export const CombinedStatsSchema = z.object({
  TotalHospitals: z.number(),
  TotalDoctors: z.number(),
  TotalAppointmentsToday: z.number(),
});

export type CombinedStats = z.infer<typeof CombinedStatsSchema>;
