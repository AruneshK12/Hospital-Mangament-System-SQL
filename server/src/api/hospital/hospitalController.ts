import type { Request, RequestHandler, Response } from "express";

import { hospitalService } from "@/api/hospital/hospitalService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class HospitalController {
  public getHospitals: RequestHandler = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const serviceResponse = await hospitalService.findAll(page, limit);
    return handleServiceResponse(serviceResponse, res);
  };

  public getHospital: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await hospitalService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public getTransactionsByHospitalId: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const hospitalId = Number.parseInt(req.params.hospitalId as string, 10);
    const serviceResponse = await hospitalService.getTransactionsByHospitalId(
      hospitalId
    );
    return handleServiceResponse(serviceResponse, res);
  };
}

export const hospitalController = new HospitalController();
