import { StatusCodes } from "http-status-codes";

import type {
  Appointment,
  NewPatient,
  Patient,
  PatientMetrics,
  PatientPaymentHistory,
  Transaction,
} from "@/api/models/patientModel";
import { PatientRepository } from "@/api/patient/patientRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class PatientService {
  private patientRepository: PatientRepository;

  constructor(repository: PatientRepository = new PatientRepository()) {
    this.patientRepository = repository;
  }

  async findAll(): Promise<ServiceResponse<Patient[] | null>> {
    try {
      const patients = await this.patientRepository.findAllAsync();
      if (!patients || patients.length === 0) {
        return ServiceResponse.failure(
          "No Patients found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Patient[]>("Patients found", patients);
    } catch (ex) {
      const errorMessage = `Error finding all patients: ${
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

  async findById(id: number): Promise<ServiceResponse<Patient | null>> {
    try {
      const patient = await this.patientRepository.findByIdAsync(id);
      if (!patient) {
        return ServiceResponse.failure(
          "Patient not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Patient>("Patient found", patient);
    } catch (ex) {
      const errorMessage = `Error finding patient with id ${id}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding patient.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addPatient(
    patient: NewPatient
  ): Promise<ServiceResponse<Patient | null>> {
    try {
      const maxIDQueryResult = await this.patientRepository.findMaxIdAsync();
      if (!maxIDQueryResult) {
        return ServiceResponse.failure(
          "Error generating patient id",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      const generatedId = maxIDQueryResult.maxId + 1;
      logger.info(`Generated id: ${generatedId}`);
      const patientWithId: Patient = { ...patient, PatientId: generatedId };
      logger.info(`Adding patient with id ${generatedId}`);
      await this.patientRepository.addPatientAsync(patientWithId);
      const newPatient = await this.patientRepository.findByIdAsync(
        generatedId
      );
      if (!newPatient) {
        return ServiceResponse.failure(
          "Error adding patient",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Patient>(
        "Patient added",
        newPatient,
        StatusCodes.CREATED
      );
    } catch (ex) {
      const errorMessage = `Error adding patient: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while adding patient.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  getRandomInt(min: number, max: number): number {
    const ceilMin = Math.ceil(min);
    const floorMax = Math.floor(max);
    return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
  }

  async updatePatient(
    patient: Patient
  ): Promise<ServiceResponse<Patient | null>> {
    try {
      const updatedPatient = await this.patientRepository.updatePatientAsync(
        patient
      );
      return ServiceResponse.success<Patient>(
        "Patient updated",
        updatedPatient
      );
    } catch (ex) {
      const errorMessage = `Error updating patient: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating patient.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deletePatient(id: number): Promise<ServiceResponse<null>> {
    try {
      await this.patientRepository.deletePatientAsync(id);
      return ServiceResponse.success<null>("Patient deleted", null);
    } catch (ex) {
      const errorMessage = `Error deleting patient: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting patient.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async signIn(
    email: string,
    password: string
  ): Promise<ServiceResponse<Patient | null>> {
    try {
      const patient = await this.patientRepository.checkSignIn(email, password);
      if (!patient) {
        return ServiceResponse.failure(
          "Invalid email or password",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }
      return ServiceResponse.success<Patient>("Sign-in successful", patient);
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

  async getPatientMetrics(
    patientId?: number
  ): Promise<ServiceResponse<PatientMetrics[] | null>> {
    try {
      const metrics = await this.patientRepository.getPatientMetricsAsync(
        patientId
      );
      return ServiceResponse.success<PatientMetrics[]>(
        "Patient metrics retrieved",
        metrics
      );
    } catch (ex) {
      const errorMessage = `Error retrieving patient metrics: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving patient metrics.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getPatientPaymentHistory(
    startDate: string,
    endDate: string
  ): Promise<ServiceResponse<PatientPaymentHistory[] | null>> {
    try {
      const history =
        await this.patientRepository.getPatientPaymentHistoryAsync(
          startDate,
          endDate
        );
      return ServiceResponse.success<PatientPaymentHistory[]>(
        "Patient payment history retrieved",
        history
      );
    } catch (ex) {
      const errorMessage = `Error retrieving patient payment history: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving patient payment history.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async makeAppointment(
    patientId: number,
    doctorId: number,
    timestamp: string
  ): Promise<ServiceResponse<Appointment | null>> {
    try {
      const appointment = await this.patientRepository.makeAppointmentAsync(
        patientId,
        doctorId,
        timestamp
      );
      return ServiceResponse.success<Appointment>(
        "Appointment created",
        appointment
      );
    } catch (ex) {
      const errorMessage = `Error creating appointment: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating appointment.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTransactionsByPatientId(
    patientId: number
  ): Promise<ServiceResponse<Transaction[] | null>> {
    try {
      const transactions =
        await this.patientRepository.getTransactionsByPatientIdAsync(patientId);
      if (!transactions || transactions.length === 0) {
        return ServiceResponse.failure(
          "No transactions found for the given PatientId",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Transaction[]>(
        "Transactions found",
        transactions
      );
    } catch (ex) {
      const errorMessage = `Error finding transactions with patientId ${patientId}: ${
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

  async modifyAppointment(
    patientId: number,
    doctorId: number,
    appointmentId: number,
    newTimestamp: string
  ): Promise<ServiceResponse<Appointment | null>> {
    const connection = await this.patientRepository.getConnection();
    try {
      logger.info(
        `Starting transaction to modify appointment with id ${appointmentId}`
      );
      await connection.beginTransaction();
      logger.info(`Cancelling existing appointment with id ${appointmentId}`);
      await this.patientRepository.cancelAppointmentAsync(
        appointmentId,
        connection
      );
      logger.info(
        `Creating new appointment for patient ${patientId} with doctor ${doctorId} at ${newTimestamp}`
      );
      const newAppointment = await this.patientRepository.makeAppointmentAsync(
        patientId,
        doctorId,
        newTimestamp,
        connection
      );
      await connection.commit();
      logger.info(
        `Transaction committed successfully for modifying appointment with id ${appointmentId}`
      );
      return ServiceResponse.success<Appointment>(
        "Appointment modified",
        newAppointment
      );
    } catch (ex) {
      await connection.rollback();
      const errorMessage = `Error modifying appointment: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while modifying appointment.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } finally {
      connection.release();
      logger.info(
        `Connection released after attempting to modify appointment with id ${appointmentId}`
      );
    }
  }

  async cancelAppointment(
    appointmentId: number
  ): Promise<ServiceResponse<null>> {
    try {
      logger.info(`Attempting to cancel appointment with id ${appointmentId}`);
      await this.patientRepository.cancelAppointmentAsync(appointmentId);
      logger.info(`Successfully canceled appointment with id ${appointmentId}`);
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
}

export const patientService = new PatientService();
