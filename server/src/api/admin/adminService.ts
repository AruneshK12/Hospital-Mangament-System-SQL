import { StatusCodes } from "http-status-codes";

import type {
  AdminLogin,
  AverageDoctorsRatingPerHospitalQueryResult,
  PatientsByDoctorRatingQueryResult,
  PatientsByTopQualifiedDoctors,
  FrequentCustomers,
  PatientCoordinateCount,
  TotalAppointmentsToday,
  TotalDoctors,
  TotalHospitals,
  CombinedStats,
} from "@/api/models/adminModel";
import { AdminRepository } from "@/api/admin/adminRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class AdminService {
  private adminRepository: AdminRepository;

  constructor(repository: AdminRepository = new AdminRepository()) {
    this.adminRepository = repository;
  }

  async findPatientsByDoctorRating(
    rating: number
  ): Promise<ServiceResponse<PatientsByDoctorRatingQueryResult[] | null>> {
    try {
      const results = await this.adminRepository.findPatientsByDoctorRating(
        rating
      );
      if (!results || results.length === 0) {
        return ServiceResponse.failure(
          "No patients found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<PatientsByDoctorRatingQueryResult[]>(
        "Patients found",
        results
      );
    } catch (ex) {
      const errorMessage = `Error finding patients by doctor rating: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving patients.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findPatientsByTopQualifiedDoctors(
    rating: number
  ): Promise<ServiceResponse<PatientsByTopQualifiedDoctors[] | null>> {
    try {
      const results =
        await this.adminRepository.findPatientsByTopQualifiedDoctors(rating);
      if (!results || results.length === 0) {
        return ServiceResponse.failure(
          "No patients found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<PatientsByTopQualifiedDoctors[]>(
        "Patients found",
        results
      );
    } catch (ex) {
      const errorMessage = `Error finding patients by top-qualified doctors: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving patients.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getDoctorsCountPerHospital(): Promise<
    ServiceResponse<AverageDoctorsRatingPerHospitalQueryResult[] | null>
  > {
    try {
      const results = await this.adminRepository.getDoctorsCountPerHospital();
      if (!results || results.length === 0) {
        return ServiceResponse.failure(
          "No hospitals found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<
        AverageDoctorsRatingPerHospitalQueryResult[]
      >(
        "Doctors Count and Average Hospital Hospital rating query executed sucessfully",
        results
      );
    } catch (ex) {
      const errorMessage = `Error finding doctors count per hospital: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding doctors count per hospitals.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async createAdminUser(
    email: string,
    hashedPassword: string
  ): Promise<ServiceResponse<null>> {
    try {
      // check if the user exists
      const isEmailExists = await this.adminRepository.isEmailExists(email);
      logger.info(`isEmailExists: ${isEmailExists}`);
      if (isEmailExists) {
        return ServiceResponse.failure(
          "Email is already registered, Please login",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }
      const newUser = await this.adminRepository.createAdminUser(
        email,
        hashedPassword
      );
      return ServiceResponse.success(
        "Admin user created",
        null,
        StatusCodes.CREATED
      );
    } catch (ex) {
      const errorMessage = `Error adding new admin user: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while adding new admin user",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async authenticateAdminUser(
    email: string,
    hashedPassword: string
  ): Promise<ServiceResponse<null>> {
    const result: AdminLogin[] =
      await this.adminRepository.authenticateAdminUser(email, hashedPassword);
    if (result.length === 0) {
      return ServiceResponse.failure(
        "Invalid email or password",
        null,
        StatusCodes.UNAUTHORIZED
      );
    }
    return ServiceResponse.success(
      "Admin user authenticated",
      null,
      StatusCodes.OK
    );
  }

  async findFrequentCustomers(): Promise<
    ServiceResponse<FrequentCustomers[] | null>
  > {
    try {
      const results = await this.adminRepository.findFrequentCustomers();
      if (!results || results.length === 0) {
        return ServiceResponse.failure(
          "No frequent customers found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<FrequentCustomers[]>(
        "Frequent customers found",
        results
      );
    } catch (ex) {
      const errorMessage = `Error finding frequent customers: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving frequent customers.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getPatientCoordinateCounts(
    startTime: string,
    endTime: string,
    allergyPattern: string
  ): Promise<ServiceResponse<PatientCoordinateCount[] | null>> {
    try {
      const results = await this.adminRepository.getPatientCoordinateCounts(
        startTime,
        endTime,
        allergyPattern
      );
      if (!results || results.length === 0) {
        return ServiceResponse.failure(
          "No patient coordinates found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<PatientCoordinateCount[]>(
        "Patient coordinates found",
        results
      );
    } catch (ex) {
      const errorMessage = `Error finding patient coordinates: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving patient coordinates.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTotalAppointmentsToday(): Promise<
    ServiceResponse<TotalAppointmentsToday | null>
  > {
    try {
      const results = await this.adminRepository.getTotalAppointmentsToday();
      if (!results) {
        return ServiceResponse.failure(
          "No appointments found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<TotalAppointmentsToday>(
        "Total appointments today found",
        results
      );
    } catch (ex) {
      const errorMessage = `Error finding total appointments today: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving total appointments today.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTotalDoctors(): Promise<ServiceResponse<TotalDoctors | null>> {
    try {
      const results = await this.adminRepository.getTotalDoctors();
      if (!results) {
        return ServiceResponse.failure(
          "No doctors found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<TotalDoctors>(
        "Total doctors found",
        results
      );
    } catch (ex) {
      const errorMessage = `Error finding total doctors: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving total doctors.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTotalHospitals(): Promise<ServiceResponse<TotalHospitals | null>> {
    try {
      const results = await this.adminRepository.getTotalHospitals();
      if (!results) {
        return ServiceResponse.failure(
          "No hospitals found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<TotalHospitals>(
        "Total hospitals found",
        results
      );
    } catch (ex) {
      const errorMessage = `Error finding total hospitals: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving total hospitals.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getCombinedStats(): Promise<ServiceResponse<CombinedStats | null>> {
    try {
      const [totalHospitals, totalDoctors, totalAppointmentsToday] =
        await Promise.all([
          this.adminRepository.getTotalHospitals(),
          this.adminRepository.getTotalDoctors(),
          this.adminRepository.getTotalAppointmentsToday(),
        ]);

      const combinedStats = {
        TotalHospitals: totalHospitals.TotalHospitals,
        TotalDoctors: totalDoctors.TotalDoctors,
        TotalAppointmentsToday: totalAppointmentsToday.TotalAppointmentsToday,
      };

      return ServiceResponse.success<CombinedStats>(
        "Combined stats found",
        combinedStats
      );
    } catch (ex) {
      const errorMessage = `Error finding combined stats: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving combined stats.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const adminService = new AdminService();
