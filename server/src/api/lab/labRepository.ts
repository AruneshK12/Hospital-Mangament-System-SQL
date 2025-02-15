import mysql from "mysql2/promise";
import { env } from "@/common/utils/envConfig";
import type {
  FindAllWithPaginationSchema,
  LabTest,
  LabTestWithReport,
} from "../models/labModel";

export class LabRepository {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async findAllAsync(
    limit: number,
    offset: number
  ): Promise<FindAllWithPaginationSchema> {
    const [rows] = await this.pool.query(
      "SELECT * FROM LabTest LIMIT ? OFFSET ?",
      [limit, offset]
    );
    const [countRows] = await this.pool.query(
      "SELECT COUNT(*) as totalRows FROM LabTest"
    );
    const labTests = rows as LabTest[];
    const totalRows = (countRows as { totalRows: number }[])[0].totalRows;
    return { labTests, totalRows };
  }

  async findByDoctorIdAsync(doctorId: number): Promise<LabTest[]> {
    const [rows] = await this.pool.query(
      `SELECT 
          lt.LabTestId,
          lt.LabTestName,
          lt.Description,
          lt.OptimalRange,
          lt.Price
      FROM 
          LabTest lt
      JOIN 
          OrderDetails od ON lt.LabTestId = od.LabTestId
      WHERE 
          od.DoctorId = ?`,
      [doctorId]
    );
    return rows as LabTest[];
  }

  async findByPatientIdAsync(patientId: number): Promise<LabTestWithReport[]> {
    const [rows] = await this.pool.query(
      `SELECT
        lt.LabTestId,
        lt.LabTestName,
        lt.Description,
        lt.OptimalRange,
        lt.Price,
        lr.Timestamp AS ReportTimestamp,
        lr.Result AS LabTestResult
      FROM
        LabTest lt
      JOIN
        OrderDetails od ON lt.LabTestId = od.LabTestId
      JOIN
        OrderTimestamp ot ON od.OrderId = ot.OrderId
      JOIN
        AppointmentDetails ad ON ot.AppointmentId = ad.AppointmentId
      JOIN
        LabReport lr ON lt.LabTestId = lr.LabTestId AND lr.PatientId = ad.PatientId
      WHERE
        ad.PatientId = ?`,
      [patientId]
    );
    return rows as LabTestWithReport[];
  }
}
