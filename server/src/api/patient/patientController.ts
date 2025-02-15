import type { Request, RequestHandler, Response } from "express";

import { patientService } from "@/api/patient/patientService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { logger } from "@/server";

class PatientController {
  public getPatients: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await patientService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getPatient: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await patientService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public addPatient: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await patientService.addPatient(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public updatePatient: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const serviceResponse = await patientService.updatePatient(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deletePatient: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await patientService.deletePatient(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public getPatientMetrics: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    logger.info("Getting patient metrics");
    const patientId = req.query.PatientId
      ? Number(req.query.PatientId)
      : undefined;
    logger.info(`PatientId: ${patientId}`);
    const serviceResponse = await patientService.getPatientMetrics(patientId);
    return handleServiceResponse(serviceResponse, res);
  };

  public getPatientPaymentHistory: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { startDate, endDate } = req.body;
    const serviceResponse = await patientService.getPatientPaymentHistory(
      startDate,
      endDate
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public makeAppointment: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { PatientId, DoctorId, Timestamp } = req.body;
    const serviceResponse = await patientService.makeAppointment(
      PatientId,
      DoctorId,
      Timestamp
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public modifyAppointment: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { PatientId, DoctorId, AppointmentId, NewTimestamp } = req.body;
    const serviceResponse = await patientService.modifyAppointment(
      PatientId,
      DoctorId,
      AppointmentId,
      NewTimestamp
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public cancelAppointment: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const appointmentId = Number.parseInt(
      req.params.appointmentId as string,
      10
    );
    const serviceResponse = await patientService.cancelAppointment(
      appointmentId
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public signIn: RequestHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const serviceResponse = await patientService.signIn(email, password);
    return handleServiceResponse(serviceResponse, res);
  };

  public getTransactionsByPatientId: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const patientId = Number.parseInt(req.params.patientId as string, 10);
    const serviceResponse = await patientService.getTransactionsByPatientId(
      patientId
    );
    return handleServiceResponse(serviceResponse, res);
  };
}

export const patientController = new PatientController();
