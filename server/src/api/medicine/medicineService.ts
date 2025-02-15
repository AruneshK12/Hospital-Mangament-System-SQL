import { StatusCodes } from "http-status-codes";
import { MedicineRepository } from "./medicineRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { Medicine } from "@/api/models/medicineModel";
import { logger } from "@/server";

export class MedicineService {
  private medicineRepository: MedicineRepository;

  constructor(repository: MedicineRepository = new MedicineRepository()) {
    this.medicineRepository = repository;
  }

  async searchMedicines(
    searchString: string
  ): Promise<ServiceResponse<Medicine[] | null>> {
    try {
      const medicines = await this.medicineRepository.searchMedicinesAsync(
        searchString
      );
      if (!medicines || medicines.length === 0) {
        return ServiceResponse.failure(
          "No medicines found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Medicine[]>("Medicines found", medicines);
    } catch (ex) {
      const errorMessage = `Error searching medicines: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while searching medicines.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const medicineService = new MedicineService();
