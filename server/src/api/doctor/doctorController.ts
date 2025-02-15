import type { Request, RequestHandler, Response } from "express";

import { doctorService } from "@/api/doctor/doctorService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class DoctorController {
  public getDoctors: RequestHandler = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const serviceResponse = await doctorService.findAll(page, limit);
    return handleServiceResponse(serviceResponse, res);
  };

  public getDoctor: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await doctorService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public getDoctorsByHospitalId: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const hospitalId = Number.parseInt(req.params.hospitalId as string, 10);
    const serviceResponse = await doctorService.findByHospitalId(hospitalId);
    return handleServiceResponse(serviceResponse, res);
  };

  public signIn: RequestHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const serviceResponse = await doctorService.signIn(email, password);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateDoctor: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await doctorService.updateDoctor(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public addAvailability: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { doctorId, startDate, endDate } = req.body;
    const serviceResponse = await doctorService.addAvailability(
      doctorId,
      startDate,
      endDate
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public getLabReportsPending: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const doctorId = Number.parseInt(req.params.doctorId as string, 10);
    const serviceResponse = await doctorService.getLabReportsPending(doctorId);
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
    const serviceResponse = await doctorService.cancelAppointment(
      appointmentId
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public getAppointmentsSummary: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const doctorId = Number.parseInt(req.params.doctorId as string, 10);
    const serviceResponse = await doctorService.getAppointmentsSummary(
      doctorId
    );
    return handleServiceResponse(serviceResponse, res);
  };
}

export const doctorController = new DoctorController();
