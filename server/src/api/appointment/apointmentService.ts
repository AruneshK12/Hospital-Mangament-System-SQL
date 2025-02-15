import { ServiceResponse } from "@/common/models/serviceResponse";
import { AppointmentRepository } from "./apointmentRepository";
import type {
  Appointment,
  AvailableAppointment,
  GroupedAvailableAppointments,
} from "@/api/models/apointmentModel";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";

export class AppointmentService {
  private apointmentRepository: AppointmentRepository;

  constructor(repository: AppointmentRepository = new AppointmentRepository()) {
    this.apointmentRepository = repository;
  }

  async getAppointmentsByPatientId(
    patientId: number
  ): Promise<ServiceResponse<Appointment[] | null>> {
    try {
      const appointments =
        await this.apointmentRepository.getAppointmentsByPatientId(patientId);
      if (!appointments || appointments.length === 0) {
        return ServiceResponse.failure(
          "No appointments found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success("Appointments found", appointments);
    } catch (ex) {
      const errorMessage = `Error fetching appointments: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while fetching appointments.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAppointmentsByDoctorId(
    doctorId: number
  ): Promise<ServiceResponse<Appointment[] | null>> {
    try {
      const appointments =
        await this.apointmentRepository.getAppointmentsByDoctorId(doctorId);
      if (!appointments || appointments.length === 0) {
        return ServiceResponse.failure(
          "No appointments found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success("Appointments found", appointments);
    } catch (ex) {
      const errorMessage = `Error fetching appointments: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while fetching appointments.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAvailableAppointmentsByDoctorIdAndDate(
    doctorId: number,
    date: string
  ): Promise<ServiceResponse<AvailableAppointment[] | null>> {
    try {
      logger.info(`Fetching available appointments for doctor ${doctorId}`);
      const availableAppointments =
        await this.apointmentRepository.getAvailableAppointmentsByDoctorIdAndDate(
          doctorId,
          date
        );
      if (!availableAppointments || availableAppointments.length === 0) {
        return ServiceResponse.failure(
          "No available appointments found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success(
        "Available appointments found",
        availableAppointments
      );
    } catch (ex) {
      const errorMessage = `Error fetching available appointments: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while fetching available appointments.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getGroupedAvailableAppointmentsByHospitalIdAndDate(
    hospitalId: number,
    date: string
  ): Promise<ServiceResponse<GroupedAvailableAppointments | null>> {
    try {
      logger.info(
        `Fetching grouped available appointments for hospital ${hospitalId} and date ${date}`
      );
      const rows =
        await this.apointmentRepository.getGroupedAvailableAppointmentsByHospitalIdAndDate(
          hospitalId,
          date
        );

      if (rows.length === 0) {
        return ServiceResponse.failure(
          "No available appointments found",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      const groupedAppointments: GroupedAvailableAppointments = {
        HospitalId: rows[0].HospitalId,
        HospitalName: rows[0].HospitalName,
        availableDoctors: [],
      };

      type DoctorAppointments = {
        DoctorId: number;
        DoctorName: string;
        Price: number;
        availableAppointments: {
          AppointmentDate: string;
          AvailableTime: string;
        }[];
      };

      const doctorMap = new Map<number, DoctorAppointments>();

      for (const row of rows) {
        if (!doctorMap.has(row.DoctorId)) {
          doctorMap.set(row.DoctorId, {
            DoctorId: row.DoctorId,
            DoctorName: row.DoctorName,
            Price: row.Price,
            availableAppointments: [],
          });
        }
        doctorMap.get(row.DoctorId)?.availableAppointments.push({
          AppointmentDate: row.AppointmentDate,
          AvailableTime: row.AvailableTime,
        });
      }

      groupedAppointments.availableDoctors = Array.from(doctorMap.values());

      return ServiceResponse.success(
        "Available appointments found",
        groupedAppointments
      );
    } catch (ex) {
      const errorMessage = `Error fetching available appointments: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while fetching available appointments.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const appointmentService = new AppointmentService();
