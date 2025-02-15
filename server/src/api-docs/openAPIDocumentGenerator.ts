import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { hospitalRegistry } from "@/api/hospital/hospitalRouter";
import { adminRegistry } from "@/api/admin/adminRouter";
import { patientRegistry } from "@/api/patient/patientRouter";
import { doctorRegistry } from "@/api/doctor/doctorRouter";
import { labRegistry } from "@/api/lab/labRouter";
import { medicineRegistry } from "@/api/medicine/medicineRouter";
import { diagnosisRegistry } from "@/api/diagnosis/diagnosisRouter";
import { apointmentRegistry } from "@/api/appointment/apointmentRouter";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    hospitalRegistry,
    adminRegistry,
    patientRegistry,
    doctorRegistry,
    labRegistry,
    medicineRegistry,
    diagnosisRegistry,
    apointmentRegistry,
  ]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}
