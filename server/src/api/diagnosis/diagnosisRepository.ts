import mysql from "mysql2/promise";
import { env } from "@/common/utils/envConfig";
import type {
  PrescriptionDetails,
  OrderDetails,
} from "@/api/models/diagnosisModel";
import type { Medicine } from "@/api/models/medicineModel";
import type { LabTest } from "@/api/models/labModel";
import type { MaxId } from "../models/patientModel";

export class DiagnosisRepository {
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

  async checkMedicineExists(medicineId: number): Promise<boolean> {
    const [rows] = await this.pool.query(
      "SELECT * FROM Medicine WHERE MedicineId = ?",
      [medicineId]
    );
    const medicines = rows as Medicine[];
    return medicines.length > 0;
  }

  async insertPrescriptionDetails(details: PrescriptionDetails): Promise<void> {
    const prescriptionId = await this.findMaxPrescriptionIdAsync();
    if (prescriptionId?.maxId === undefined) {
      throw new Error("Failed to retrieve max prescription ID");
    }
    await this.pool.query(
      "INSERT INTO PrescriptionDetails (PrescriptionId, AppointmentId, DoctorId, MedicineId) VALUES (?, ?, ?, ?)",
      [
        prescriptionId?.maxId + 1,
        details.AppointmentId,
        details.DoctorId,
        details.MedicineId,
      ]
    );
    await this.pool.query(
      "INSERT INTO PrescriptionTimestamp (PrescriptionId, Timestamp) VALUES (?, ?)",
      [prescriptionId.maxId + 1, details.Timestamp]
    );
  }

  async checkLabTestExists(labTestId: number): Promise<boolean> {
    const [rows] = await this.pool.query(
      "SELECT * FROM LabTest WHERE LabTestId = ?",
      [labTestId]
    );
    const labTests = rows as LabTest[];
    return labTests.length > 0;
  }

  async insertOrderDetails(details: OrderDetails): Promise<void> {
    const orderId = await this.findMaxOrderIdAsync();
    if (orderId?.maxId === undefined) {
      throw new Error("Failed to retrieve max order ID");
    }
    await this.pool.query(
      "INSERT INTO OrderDetails (OrderId, DoctorId, LabTestId) VALUES (?, ?, ?)",
      [orderId.maxId + 1, details.DoctorId, details.LabTestId]
    );

    await this.pool.query(
      "INSERT INTO OrderTimestamp (OrderId, AppointmentId, Timestamp) VALUES (?, ?, ?)",
      [orderId.maxId + 1, details.AppointmentId, details.Timestamp]
    );
  }

  async updateAppointmentStatus(
    appointmentId: number,
    status: string
  ): Promise<void> {
    await this.pool.query(
      "UPDATE AppointmentStatus SET Status = ?, Timestamp = ? WHERE AppointmentId = ?",
      [status, new Date(), appointmentId]
    );
  }

  async findMaxOrderIdAsync(): Promise<MaxId | null> {
    const [rows] = await this.pool.query(
      "SELECT MAX(OrderId) as maxId FROM OrderDetails"
    );
    const res = rows as MaxId[];
    return res[0];
  }

  async findMaxPrescriptionIdAsync(): Promise<MaxId | null> {
    const [rows] = await this.pool.query(
      "SELECT MAX(PrescriptionId) as maxId FROM PrescriptionDetails"
    );
    const res = rows as MaxId[];
    return res[0];
  }
}
