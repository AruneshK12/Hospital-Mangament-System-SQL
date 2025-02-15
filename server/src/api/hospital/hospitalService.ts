import { StatusCodes } from "http-status-codes";

import type {
  FindAllWithPaginationSchema,
  Hospital,
  Transaction,
} from "@/api/models/hospitalModel";
import { HospitalRepository } from "@/api/hospital/hospitalRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class HospitalService {
  private hospitalRepository: HospitalRepository;

  constructor(repository: HospitalRepository = new HospitalRepository()) {
    this.hospitalRepository = repository;
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<ServiceResponse<FindAllWithPaginationSchema | null>> {
    try {
      const offset = (page - 1) * limit;
      const result: FindAllWithPaginationSchema =
        await this.hospitalRepository.findAllAsync(limit, offset);
      if (!result.hospitals || result.hospitals.length === 0) {
        return ServiceResponse.failure(
          "No Hospitals found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success("Hospitals found", result);
    } catch (ex) {
      const errorMessage = `Error finding hospitals: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving hospitals.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<Hospital | null>> {
    try {
      const hospital = await this.hospitalRepository.findByIdAsync(id);
      if (!hospital) {
        return ServiceResponse.failure(
          "Hospital not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Hospital>("Hospital found", hospital);
    } catch (ex) {
      const errorMessage = `Error finding hospital with id ${id}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding hospital.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTransactionsByHospitalId(
    hospitalId: number
  ): Promise<ServiceResponse<Transaction[] | null>> {
    try {
      const transactions =
        await this.hospitalRepository.getTransactionsByHospitalIdAsync(
          hospitalId
        );
      if (!transactions || transactions.length === 0) {
        return ServiceResponse.failure(
          "No transactions found for the given HospitalId",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Transaction[]>(
        "Transactions found",
        transactions
      );
    } catch (ex) {
      const errorMessage = `Error finding transactions with hospitalId ${hospitalId}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding transactions.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const hospitalService = new HospitalService();
