import { StatusCodes } from "http-status-codes";

import type {
  Doctor,
  FindAllWithPaginationSchema,
  LabReportPending,
  AppointmentsSummary,
} from "@/api/models/doctorModel";
import { DoctorRepository } from "@/api/doctor/doctorRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class DoctorService {
  private doctorRepository: DoctorRepository;

  constructor(repository: DoctorRepository = new DoctorRepository()) {
    this.doctorRepository = repository;
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<ServiceResponse<FindAllWithPaginationSchema | null>> {
    try {
      const offset = (page - 1) * limit;
      const result: FindAllWithPaginationSchema =
        await this.doctorRepository.findAllAsync(limit, offset);
      if (!result.doctors || result.doctors.length === 0) {
        return ServiceResponse.failure(
          "No Doctors found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success("Doctors found", result);
    } catch (ex) {
      const errorMessage = `Error finding doctors: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving doctors.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<Doctor | null>> {
    try {
      const doctor = await this.doctorRepository.findByIdAsync(id);
      if (!doctor) {
        return ServiceResponse.failure(
          "Doctor not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Doctor>("Doctor found", doctor);
    } catch (ex) {
      const errorMessage = `Error finding doctor with id ${id}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding doctor.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByHospitalId(
    hospitalId: number
  ): Promise<ServiceResponse<Doctor[] | null>> {
    try {
      const doctors = await this.doctorRepository.findByHospitalIdAsync(
        hospitalId
      );
      if (!doctors || doctors.length === 0) {
        return ServiceResponse.failure(
          "No Doctors found for the given HospitalId",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Doctor[]>("Doctors found", doctors);
    } catch (ex) {
      const errorMessage = `Error finding doctors with hospitalId ${hospitalId}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding doctors.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async signIn(
    email: string,
    password: string
  ): Promise<ServiceResponse<Doctor | null>> {
    try {
      const doctor = await this.doctorRepository.checkSignIn(email, password);
      if (!doctor) {
        return ServiceResponse.failure(
          "Invalid email or password",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }
      return ServiceResponse.success<Doctor>("Sign-in successful", doctor);
    } catch (ex) {
      const errorMessage = `Error during sign-in: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred during sign-in.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateDoctor(doctor: Doctor): Promise<ServiceResponse<Doctor | null>> {
    try {
      const updatedDoctor = await this.doctorRepository.updateDoctorAsync(
        doctor
      );
      return ServiceResponse.success<Doctor>("Doctor updated", updatedDoctor);
    } catch (ex) {
      const errorMessage = `Error updating doctor: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating doctor.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addAvailability(
    doctorId: number,
    startDate: string,
    endDate: string
  ): Promise<ServiceResponse<null>> {
    try {
      await this.doctorRepository.addAvailabilityAsync(
        doctorId,
        startDate,
        endDate
      );
      return ServiceResponse.success<null>(
        "Availability added successfully",
        null
      );
    } catch (ex) {
      const errorMessage = `Error adding availability for doctorId ${doctorId}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while adding availability.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getLabReportsPending(
    doctorId: number
  ): Promise<ServiceResponse<LabReportPending[] | null>> {
    try {
      const reports = await this.doctorRepository.getLabReportsPending(
        doctorId
      );
      return ServiceResponse.success("Lab reports pending", reports);
    } catch (ex) {
      const errorMessage = `Error fetching lab reports pending: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while fetching lab reports pending.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async cancelAppointment(
    appointmentId: number
  ): Promise<ServiceResponse<null>> {
    try {
      await this.doctorRepository.cancelAppointmentAsync(appointmentId);
      return ServiceResponse.success<null>("Appointment canceled", null);
    } catch (ex) {
      const errorMessage = `Error canceling appointment: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while canceling appointment.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAppointmentsSummary(
    doctorId: number
  ): Promise<ServiceResponse<AppointmentsSummary | null>> {
    try {
      const [completed, pending, labReports] = await Promise.all([
        this.doctorRepository.getAppointmentsCompletedToday(doctorId),
        this.doctorRepository.getAppointmentsPendingToday(doctorId),
        this.doctorRepository.getPendingLabReportsCount(doctorId),
      ]);

      const summary: AppointmentsSummary = {
        AppointmentsCompletedToday: completed,
        AppointmentsPendingToday: pending,
        PendingLabReports: labReports,
      };

      return ServiceResponse.success("Appointments summary found", summary);
    } catch (ex) {
      const errorMessage = `Error fetching appointments summary: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while fetching appointments summary.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const doctorService = new DoctorService();
