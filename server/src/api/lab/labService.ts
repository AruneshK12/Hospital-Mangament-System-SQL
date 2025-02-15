import { StatusCodes } from "http-status-codes";
import { LabRepository } from "./labRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type {
  LabTest,
  LabTestWithReport,
  FindAllWithPaginationSchema,
} from "../models/labModel";
import { logger } from "@/server";

export class LabService {
  private labRepository: LabRepository;

  constructor(repository: LabRepository = new LabRepository()) {
    this.labRepository = repository;
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<ServiceResponse<FindAllWithPaginationSchema | null>> {
    try {
      const offset = (page - 1) * limit;
      const result: FindAllWithPaginationSchema =
        await this.labRepository.findAllAsync(limit, offset);
      if (!result.labTests || result.labTests.length === 0) {
        return ServiceResponse.failure(
          "No Lab Tests found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success("Lab Tests found", result);
    } catch (ex) {
      const errorMessage = `Error finding lab tests: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving lab tests.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByDoctorId(
    doctorId: number
  ): Promise<ServiceResponse<LabTest[] | null>> {
    try {
      const labTests = await this.labRepository.findByDoctorIdAsync(doctorId);
      if (!labTests || labTests.length === 0) {
        return ServiceResponse.failure(
          "No Lab Tests found for the given DoctorId",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<LabTest[]>("Lab Tests found", labTests);
    } catch (ex) {
      const errorMessage = `Error finding lab tests with doctorId ${doctorId}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding lab tests.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByPatientId(
    patientId: number
  ): Promise<ServiceResponse<LabTestWithReport[] | null>> {
    try {
      logger.info(`Finding lab tests with patientId ${patientId}`);
      const labTests = await this.labRepository.findByPatientIdAsync(patientId);
      if (!labTests || labTests.length === 0) {
        return ServiceResponse.failure(
          "No Lab Tests found for the given PatientId",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<LabTestWithReport[]>(
        "Lab Tests found",
        labTests
      );
    } catch (ex) {
      const errorMessage = `Error finding lab tests with patientId ${patientId}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding lab tests.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const labService = new LabService();
