import type { Request, RequestHandler, Response } from "express";
import { labService } from "./labService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class LabController {
  public getLabTests: RequestHandler = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const serviceResponse = await labService.findAll(page, limit);
    return handleServiceResponse(serviceResponse, res);
  };

  public getLabTestsByDoctorId: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const doctorId = Number.parseInt(req.params.doctorId as string, 10);
    const serviceResponse = await labService.findByDoctorId(doctorId);
    return handleServiceResponse(serviceResponse, res);
  };

  public getLabTestsByPatientId: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const patientId = Number.parseInt(req.params.patientId as string, 10);
    const serviceResponse = await labService.findByPatientId(patientId);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const labController = new LabController();
