import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { hospitalRouter } from "@/api/hospital/hospitalRouter";
import { adminRouter } from "@/api/admin/adminRouter";
import { patientRouter } from "@/api/patient/patientRouter";
import { doctorRouter } from "@/api/doctor/doctorRouter";
import { medicineRouter } from "@/api/medicine/medicineRouter";
import { labRouter } from "@/api/lab/labRouter";
import { diagnosisRouter } from "@/api/diagnosis/diagnosisRouter";
import { apointmentRouter } from "./api/appointment/apointmentRouter";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/hospitals", hospitalRouter);
app.use("/admin", adminRouter);
app.use("/patients", patientRouter);
app.use("/doctors", doctorRouter);
app.use("/lab-tests", labRouter);
app.use("/medicines", medicineRouter);
app.use("/diagnosis", diagnosisRouter);
app.use("/appointments", apointmentRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
