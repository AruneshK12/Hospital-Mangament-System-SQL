import { StatusCodes } from "http-status-codes";
import type { Diagnosis } from "@/api/models/diagnosisModel";
import { DiagnosisRepository } from "@/api/diagnosis/diagnosisRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class DiagnosisService {
  private diagnosisRepository: DiagnosisRepository;

  constructor(repository: DiagnosisRepository = new DiagnosisRepository()) {
    this.diagnosisRepository = repository;
  }

  async handleDiagnosis(diagnosis: Diagnosis): Promise<ServiceResponse<null>> {
    try {
      const { AppointmentId, PatientId, DoctorId, MedicineId, LabTestId } =
        diagnosis;

      const medicineExists = await this.diagnosisRepository.checkMedicineExists(
        MedicineId
      );
      if (!medicineExists) {
        return ServiceResponse.failure(
          "Medicine does not exist",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      logger.info("Updating appointment status to Completed");
      await this.diagnosisRepository.updateAppointmentStatus(
        AppointmentId,
        "Completed"
      );

      const id = Date.now();
      const timestamp = new Date();
      logger.info(`Id: ${id}, Timestamp: ${timestamp}`);
      logger.info("Inserting prescription details and timestamp");
      await this.diagnosisRepository.insertPrescriptionDetails({
        AppointmentId,
        DoctorId,
        MedicineId,
        Timestamp: timestamp,
      });

      const labTestExists = await this.diagnosisRepository.checkLabTestExists(
        LabTestId
      );
      if (!labTestExists) {
        return ServiceResponse.failure(
          "Lab Test does not exist",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      logger.info("Inserting order details and timestamp");
      await this.diagnosisRepository.insertOrderDetails({
        DoctorId,
        LabTestId,
        AppointmentId,
        Timestamp: new Date(),
      });

      return ServiceResponse.success<null>(
        "Diagnosis handled successfully",
        null
      );
    } catch (ex) {
      const errorMessage = `Error handling diagnosis: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while handling diagnosis.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const diagnosisService = new DiagnosisService();
