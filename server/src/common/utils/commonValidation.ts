import { z } from "zod";

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
    .transform(Number)
    .refine((num) => num >= 0, "ID must be a positive number"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format"), // YYYY-MM-DD format
  gender: z.enum(["M", "F"]).refine((val) => ["M", "F"].includes(val), {
    message: "Gender must be either 'M' or 'F'",
  }),
  address: z.string().min(1, "Address is required"),
  phone: z
    .string()
    .regex(
      /^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/,
      "Phone number must be in the format +X-XXX-XXX-XXXX"
    ),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
};
