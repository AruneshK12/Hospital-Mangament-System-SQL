import mysql from "mysql2/promise";
import { env } from "@/common/utils/envConfig";
import type {
  Appointment,
  AvailableAppointment,
  AvailableAppointmentPerHospital,
  GroupedAvailableAppointments,
} from "@/api/models/apointmentModel";
import { a } from "vitest/dist/chunks/suite.B2jumIFP";

export class AppointmentRepository {
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

  async getAppointmentsByPatientId(patientId: number): Promise<Appointment[]> {
    const [rows] = await this.pool.query(
      `SELECT 
          a.AppointmentId,
          a.PatientId,
          a.DoctorId,
          CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
          CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
          p.Email AS PatientEmail,
          p.Phone AS PatientPhone,
          d.Price AS ConsultationPrice,
          DATE(s.Timestamp) AS AppointmentDate,
          TIME(s.Timestamp) AS AppointmentTime,
          s.Status AS AppointmentStatus
      FROM 
          AppointmentDetails a
      LEFT JOIN Patient p ON a.PatientId = p.PatientId
      LEFT JOIN Doctor d ON a.DoctorId = d.DoctorId
      LEFT JOIN AppointmentStatus s ON a.AppointmentId = s.AppointmentId
      WHERE 
          a.PatientId = ?
      ORDER BY
        AppointmentDate, AppointmentTime;`,
      [patientId]
    );
    return rows as Appointment[];
  }

  async getAppointmentsByDoctorId(doctorId: number): Promise<Appointment[]> {
    const [rows] = await this.pool.query(
      `SELECT 
          a.AppointmentId,
          a.PatientId,
          a.DoctorId,
          CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
          CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
          p.Email AS PatientEmail,
          p.Phone AS PatientPhone,
          d.Price AS ConsultationPrice,
          DATE(s.Timestamp) AS AppointmentDate,
          TIME(s.Timestamp) AS AppointmentTime,
          s.Status AS AppointmentStatus
      FROM 
          AppointmentDetails a
      LEFT JOIN Patient p ON a.PatientId = p.PatientId
      LEFT JOIN Doctor d ON a.DoctorId = d.DoctorId
      LEFT JOIN AppointmentStatus s ON a.AppointmentId = s.AppointmentId
      WHERE 
          d.DoctorId = ?
          AND s.Status = 'Scheduled'
      ORDER BY
        AppointmentDate, AppointmentTime;`,
      [doctorId]
    );
    return rows as Appointment[];
  }

  async getAvailableAppointmentsByDoctorIdAndDate(
    doctorId: number,
    date: string
  ): Promise<AvailableAppointment[]> {
    const [rows] = await this.pool.query(
      `SELECT 
          d.DoctorId,
          CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
          d.Price,
          DATE(s.Timestamp) AS AppointmentDate,
          TIME(s.Timestamp) AS AvailableTime
      FROM 
          Doctor d
      JOIN AppointmentDetails a ON d.DoctorId = a.DoctorId
      JOIN AppointmentStatus s ON a.AppointmentId = s.AppointmentId
      WHERE 
          d.DoctorId = ? AND
          s.Status = 'Open' 
          AND DATE(s.Timestamp) = ?
      ORDER BY 
          AvailableTime`,
      [doctorId, date]
    );
    return rows as AvailableAppointment[];
  }

  async getGroupedAvailableAppointmentsByHospitalIdAndDate(
    hospitalId: number,
    date: string
  ): Promise<AvailableAppointmentPerHospital[]> {
    const [rows] = await this.pool.query(
      `SELECT 
          d.DoctorId,
          CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
          d.Price,
          h.HospitalId,
          h.HospitalName,
          DATE(s.Timestamp) AS AppointmentDate,
          TIME(s.Timestamp) AS AvailableTime
      FROM 
          Doctor d
      JOIN Hospital h ON d.HospitalId = h.HospitalId
      JOIN AppointmentDetails a ON d.DoctorId = a.DoctorId
      JOIN AppointmentStatus s ON a.AppointmentId = s.AppointmentId
      WHERE 
          h.HospitalId = ? 
          AND s.Status = 'Open'
          AND DATE(s.Timestamp) = ?
      ORDER BY 
          d.DoctorId, AvailableTime`,
      [hospitalId, date]
    );
    return rows as AvailableAppointmentPerHospital[];
  }
}
