import type { Request, RequestHandler, Response } from "express";
import { diagnosisService } from "@/api/diagnosis/diagnosisService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class DiagnosisController {
  public handleDiagnosis: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const serviceResponse = await diagnosisService.handleDiagnosis(req.body);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const diagnosisController = new DiagnosisController();
