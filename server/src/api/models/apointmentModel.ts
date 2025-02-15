import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const AppointmentSchema = z.object({
  AppointmentId: z.number(),
  PatientId: z.number(),
  DoctorId: z.number(),
  PatientEmail: z.string(),
  PatientPhone: z.string(),
  ConsultationPrice: z.number(),
  PatientName: z.string(),
  DoctorName: z.string(),
  AppointmentStatus: z.string(),
  AppointmentTime: z.string(),
  AppointmentDate: z.string(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

export const AvailableAppointmentSchema = z.object({
  DoctorId: z.number(),
  DoctorName: z.string(),
  Price: z.number(),
  AppointmentDate: z.string(),
  AvailableTime: z.string(),
});

export type AvailableAppointment = z.infer<typeof AvailableAppointmentSchema>;

export const AvailableAppointmentPerHospitalSchema = z.object({
  DoctorId: z.number(),
  DoctorName: z.string(),
  Price: z.number(),
  HospitalId: z.number(),
  HospitalName: z.string(),
  AppointmentDate: z.string(),
  AvailableTime: z.string(),
});

export type AvailableAppointmentPerHospital = z.infer<
  typeof AvailableAppointmentPerHospitalSchema
>;

export const GroupedAvailableAppointmentsSchema = z.object({
  HospitalId: z.number(),
  HospitalName: z.string(),
  availableDoctors: z.array(
    z.object({
      DoctorId: z.number(),
      DoctorName: z.string(),
      Price: z.number(),
      availableAppointments: z.array(
        z.object({
          AppointmentDate: z.string(),
          AvailableTime: z.string(),
        })
      ),
    })
  ),
});

export type GroupedAvailableAppointments = z.infer<
  typeof GroupedAvailableAppointmentsSchema
>;
