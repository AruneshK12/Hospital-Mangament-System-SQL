import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Hospital = z.infer<typeof HospitalSchema>;
export const HospitalSchema = z.object({
  HospitalId: z.number(),
  HospitalName: z.string(),
  Address: z.string(),
  Rating: z.number(),
  Phone: z.number(),
  Email: z.string().email(),
});

// Input Validation for 'GET Hospital/:id' endpoint
export const GetHospitalSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const PaginationSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
});

export const FindAllWithPagination = z.object({
  hospitals: z.array(HospitalSchema),
  totalRows: z.number(),
});

export type FindAllWithPaginationSchema = z.infer<typeof FindAllWithPagination>;
export const RowCountQuery = z.object({
  total: z.number(),
});

export type RowCountQuerySchema = z.infer<typeof RowCountQuery>;

export const TransactionSchema = z.object({
  TransactionId: z.number(),
  Timestamp: z.string(),
  Amount: z.number(),
  Mode: z.string(),
  PatientId: z.number(),
  PatientFirstName: z.string(),
  PatientLastName: z.string(),
  HospitalName: z.string(),
});

export const GetTransactionsByHospitalSchema = z.object({
  params: z.object({ hospitalId: z.number() }),
});

export type Transaction = z.infer<typeof TransactionSchema>;
