import mysql from "mysql2/promise";
import { env } from "@/common/utils/envConfig";
import type {
  Appointment,
  MaxId,
  Patient,
  PatientMetrics,
  PatientPaymentHistory,
  Transaction,
} from "@/api/models/patientModel";

export class PatientRepository {
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

  async findAllAsync(): Promise<Patient[]> {
    const [rows] = await this.pool.query("SELECT * FROM Patient");
    return rows as Patient[];
  }

  async findByIdAsync(id: number): Promise<Patient | null> {
    const [rows] = await this.pool.query(
      "SELECT * FROM Patient WHERE PatientId = ?",
      [id]
    );
    const patients = rows as Patient[];
    return patients.length > 0 ? patients[0] : null;
  }

  async findMaxIdAsync(): Promise<MaxId | null> {
    const [rows] = await this.pool.query(
      "SELECT MAX(Patient.PatientId) as maxId FROM Patient;"
    );
    const res = rows as MaxId[];
    return res[0];
  }

  async addPatientAsync(patient: Patient): Promise<Patient> {
    const [result] = await this.pool.query(
      "INSERT INTO Patient (PatientId, FirstName, LastName, DateOfBirth, Gender, Address, Phone, Email, Password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        patient.PatientId,
        patient.FirstName,
        patient.LastName,
        patient.DateOfBirth,
        patient.Gender,
        patient.Address,
        patient.Phone,
        patient.Email,
        patient.Password,
      ]
    );
    const insertId = (result as mysql.ResultSetHeader).insertId;
    return this.findByIdAsync(insertId) as Promise<Patient>;
  }

  async updatePatientAsync(patient: Patient): Promise<Patient> {
    await this.pool.query(
      "UPDATE Patient SET FirstName = ?, LastName = ?, DateOfBirth = ?, Gender = ?, Address = ?, Phone = ?, Email = ?, Password = ? WHERE PatientId = ?",
      [
        patient.FirstName,
        patient.LastName,
        patient.DateOfBirth,
        patient.Gender,
        patient.Address,
        patient.Phone,
        patient.Email,
        patient.Password,
        patient.PatientId,
      ]
    );
    return this.findByIdAsync(patient.PatientId) as Promise<Patient>;
  }

  async deletePatientAsync(id: number): Promise<void> {
    await this.pool.query("DELETE FROM Patient WHERE PatientId = ?", [id]);
  }

  async checkSignIn(email: string, password: string): Promise<Patient | null> {
    const [rows] = await this.pool.query(
      "SELECT * FROM Patient WHERE Email = ? AND Password = ?",
      [email, password]
    );
    const patients = rows as Patient[];
    return patients.length > 0 ? patients[0] : null;
  }

  async getPatientMetricsAsync(patientId?: number): Promise<PatientMetrics[]> {
    let query = `
      SELECT
          p.PatientId,
          p.FirstName,
          p.LastName,
          COUNT(a.AppointmentId) AS TotalAppointments,
          SUM(CASE
              WHEN s.Status IN ('Scheduled', 'Pending') THEN 1
              ELSE 0
          END) AS AppointmentsLeft,
          COUNT(DISTINCT ot.OrderId) -
          COUNT(DISTINCT lr.LabReportId) AS LabReportsPending
      FROM
          Patient p
      LEFT JOIN AppointmentDetails a ON p.PatientId = a.PatientId
      LEFT JOIN AppointmentStatus s ON a.AppointmentId = s.AppointmentId
      LEFT JOIN OrderTimestamp ot ON a.AppointmentId = ot.AppointmentId
      LEFT JOIN OrderDetails od ON ot.OrderId = od.OrderId
      LEFT JOIN LabReport lr ON lr.PatientId = p.PatientId
    `;
    const params: (number | undefined)[] = [];
    if (patientId) {
      query += " WHERE p.PatientId = ?";
      params.push(patientId);
    }
    query += `
      GROUP BY
          p.PatientId,
          p.FirstName,
          p.LastName
      ORDER BY
          p.PatientId
    `;
    const [rows] = await this.pool.query(query, params);
    return rows as PatientMetrics[];
  }

  async getPatientPaymentHistoryAsync(
    startDate: string,
    endDate: string
  ): Promise<PatientPaymentHistory[]> {
    const [rows] = await this.pool.query(
      `SELECT
          p.PatientId,
          p.FirstName,
          p.LastName,
          SUM(t.Amount) AS TotalBilled,
          SUM(CASE
              WHEN t.Mode IN ('Cash', 'Credit Card', 'Insurance') THEN t.Amount
              ELSE 0
          END) AS TotalPaid
      FROM
          Patient p
      LEFT JOIN Transaction t ON p.PatientId = t.PatientId
      WHERE
          t.Timestamp BETWEEN ? AND ?
      GROUP BY
          p.PatientId,
          p.FirstName,
          p.LastName
      ORDER BY
          p.PatientId`,
      [startDate, endDate]
    );
    return rows as PatientPaymentHistory[];
  }

  async makeAppointmentAsync(
    patientId: number,
    doctorId: number,
    timestamp: string,
    connection?: mysql.PoolConnection
  ): Promise<Appointment> {
    const conn = connection || this.pool;
    await conn.query("CALL create_appointment(?, ?, ?)", [
      patientId,
      doctorId,
      timestamp,
    ]);

    const [rows] = await conn.query(
      `SELECT 
          a.AppointmentId,
          p.FirstName AS PatientFirstName,
          p.LastName AS PatientLastName,
          d.FirstName AS DoctorFirstName,
          d.LastName AS DoctorLastName,
          d.HospitalId,
          h.HospitalName,
          s.Status AS AppointmentStatus,
          s.Timestamp AS AppointmentTimestamp
      FROM 
          AppointmentDetails a
      JOIN 
          Patient p ON a.PatientId = p.PatientId
      JOIN 
          Doctor d ON a.DoctorId = d.DoctorId
      LEFT JOIN 
          Hospital h ON d.HospitalId = h.HospitalId
      LEFT JOIN 
          AppointmentStatus s ON a.AppointmentId = s.AppointmentId
      WHERE 
          a.PatientId = ? AND a.DoctorId = ? AND s.Timestamp = ?`,
      [patientId, doctorId, timestamp]
    );

    return (rows as Appointment[])[0];
  }

  async cancelAppointmentAsync(
    appointmentId: number,
    connection?: mysql.PoolConnection
  ): Promise<void> {
    const conn = connection || this.pool;
    await conn.query("CALL cancel_patient_appointment(?)", [appointmentId]);
  }

  async getTransactionsByPatientIdAsync(
    patientId: number
  ): Promise<Transaction[]> {
    const [rows] = await this.pool.query(
      `SELECT 
          t.TransactionId,
          t.Timestamp,
          t.Amount,
          t.Mode,
          t.Type,
          h.HospitalName,
          p.FirstName AS PatientFirstName,
          p.LastName AS PatientLastName
      FROM 
          Transaction t
      JOIN 
          Patient p ON t.PatientId = p.PatientId
      LEFT JOIN 
          Hospital h ON t.HospitalId = h.HospitalId
      WHERE 
          t.PatientId = ?`,
      [patientId]
    );
    return rows as Transaction[];
  }

  async getConnection(): Promise<mysql.PoolConnection> {
    return this.pool.getConnection();
  }
}
