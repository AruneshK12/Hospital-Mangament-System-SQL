import type { Request, RequestHandler, Response } from "express";
import { medicineService } from "@/api/medicine/medicineService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class MedicineController {
  public searchMedicines: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const searchString = req.query.searchString as string;
    const serviceResponse = await medicineService.searchMedicines(searchString);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const medicineController = new MedicineController();
