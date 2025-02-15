import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const LabTestSchema = z.object({
  LabTestId: z.number(),
  LabTestName: z.string(),
  Description: z.string(),
  OptimalRange: z.string(),
  Price: z.number().min(0),
});

export const LabTestWithReportSchema = LabTestSchema.extend({
  ReportTimestamp: z.string(),
  LabTestResult: z.string(),
});

export const GetLabTestsByDoctorSchema = z.object({
  params: z.object({ doctorId: z.number() }),
});

export const GetLabTestsByPatientSchema = z.object({
  params: z.object({ patientId: z.number() }),
});

export const PaginationSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
});

export const FindAllWithPagination = z.object({
  labTests: z.array(LabTestSchema),
  totalRows: z.number(),
});

export type LabTest = z.infer<typeof LabTestSchema>;
export type LabTestWithReport = z.infer<typeof LabTestWithReportSchema>;
export type FindAllWithPaginationSchema = z.infer<typeof FindAllWithPagination>;
