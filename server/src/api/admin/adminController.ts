import type { Request, RequestHandler, Response } from "express";

import { adminService } from "@/api/admin/adminService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import md5 from "md5";

class AdminController {
  public getPatientsByDoctorRating: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const rating = Number.parseFloat(req.query.rating as string);
    const serviceResponse = await adminService.findPatientsByDoctorRating(
      rating
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public getDoctorsCountPerHospital: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await adminService.getDoctorsCountPerHospital();
    return handleServiceResponse(serviceResponse, res);
  };

  public registerAdmin: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { email, password } = req.body;
    const hashedPassword = md5(password);
    const serviceResponse = await adminService.createAdminUser(
      email,
      hashedPassword
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public loginAdmin: RequestHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const hashedPassword = md5(password);
    const serviceResponse = await adminService.authenticateAdminUser(
      email,
      hashedPassword
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public getPatientsByTopQualifiedDoctors: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const rating = Number.parseFloat(req.query.rating as string);
    const serviceResponse =
      await adminService.findPatientsByTopQualifiedDoctors(rating);
    return handleServiceResponse(serviceResponse, res);
  };

  public getFrequentCustomers: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await adminService.findFrequentCustomers();
    return handleServiceResponse(serviceResponse, res);
  };

  public getPatientCoordinateCounts: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { startTime, endTime, allergyPattern } = req.body;
    const serviceResponse = await adminService.getPatientCoordinateCounts(
      startTime,
      endTime,
      allergyPattern
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public getTotalAppointmentsToday: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await adminService.getTotalAppointmentsToday();
    return handleServiceResponse(serviceResponse, res);
  };

  public getTotalDoctors: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await adminService.getTotalDoctors();
    return handleServiceResponse(serviceResponse, res);
  };

  public getTotalHospitals: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await adminService.getTotalHospitals();
    return handleServiceResponse(serviceResponse, res);
  };

  public getCombinedStats: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await adminService.getCombinedStats();
    return handleServiceResponse(serviceResponse, res);
  };
}

export const adminController = new AdminController();
