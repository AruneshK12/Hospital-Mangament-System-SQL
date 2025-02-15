import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";

import { appointmentService } from "@/api/appointment/apointmentService";
import { logger } from "@/server";

class AppointmentController {
  public getAppointmentsByPatientId: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const patientId = Number.parseInt(req.params.patientId as string, 10);
    logger.info(`Fetching appointments for patient ${patientId}`);
    const serviceResponse = await appointmentService.getAppointmentsByPatientId(
      patientId
    );
    logger.info(`Appointments for patient ${patientId} fetched successfully`);
    return handleServiceResponse(serviceResponse, res);
  };

  public getAppointmentsByDoctorId: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const doctorId = Number.parseInt(req.params.doctorId as string, 10);
    logger.info(`Fetching appointments for doctor ${doctorId}`);
    const serviceResponse = await appointmentService.getAppointmentsByDoctorId(
      doctorId
    );
    logger.info(`Appointments for doctor ${doctorId} fetched successfully`);
    return handleServiceResponse(serviceResponse, res);
  };

  public getAvailableAppointmentsByDoctorIdAndDate: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const doctorId = Number(req.params.doctorId);
    const { date } = req.query;
    logger.info(
      `Fetching available appointments for doctor ${doctorId} and date ${date}`
    );
    const serviceResponse =
      await appointmentService.getAvailableAppointmentsByDoctorIdAndDate(
        doctorId,
        date as string
      );
    logger.info(
      `Available appointments for doctor ${doctorId} fetched successfully`
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public getGroupedAvailableAppointmentsByHospitalIdAndDate: RequestHandler =
    async (req: Request, res: Response) => {
      const hospitalId = Number(req.params.hospitalId);
      const { date } = req.query;
      logger.info(
        `Fetching grouped available appointments for hospital ${hospitalId} and date ${date}`
      );
      const serviceResponse =
        await appointmentService.getGroupedAvailableAppointmentsByHospitalIdAndDate(
          hospitalId,
          date as string
        );
      logger.info(
        `Grouped available appointments for hospital ${hospitalId} fetched successfully`
      );
      return handleServiceResponse(serviceResponse, res);
    };
}

export const appointmentController = new AppointmentController();
