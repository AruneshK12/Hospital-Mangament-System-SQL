import mysql from "mysql2/promise";
import { env } from "@/common/utils/envConfig";
import type {
  Doctor,
  FindAllWithPaginationSchema,
  LabReportPending,
} from "@/api/models/doctorModel";

export class DoctorRepository {
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
      "SELECT * FROM Doctor LIMIT ? OFFSET ?",
      [limit, offset]
    );
    const [countRows] = await this.pool.query(
      "SELECT COUNT(*) as totalRows FROM Doctor"
    );
    const doctors = rows as Doctor[];
    const totalRows = (countRows as { totalRows: number }[])[0].totalRows;
    return { doctors, totalRows };
  }

  async findByIdAsync(id: number): Promise<Doctor | null> {
    const [rows] = await this.pool.query(
      "SELECT * FROM Doctor WHERE DoctorId = ?",
      [id]
    );
    const doctors = rows as Doctor[];
    return doctors.length > 0 ? doctors[0] : null;
  }

  async findByHospitalIdAsync(hospitalId: number): Promise<Doctor[]> {
    const [rows] = await this.pool.query(
      "SELECT * FROM Doctor WHERE HospitalId = ?",
      [hospitalId]
    );
    return rows as Doctor[];
  }

  async checkSignIn(email: string, password: string): Promise<Doctor | null> {
    const [rows] = await this.pool.query(
      "SELECT * FROM Doctor WHERE Email = ? AND Password = ?",
      [email, password]
    );
    const doctors = rows as Doctor[];
    return doctors.length > 0 ? doctors[0] : null;
  }

  async updateDoctorAsync(doctor: Doctor): Promise<Doctor> {
    await this.pool.query(
      "UPDATE Doctor SET FirstName = ?, LastName = ?, Gender = ?, Rating = ?, Price = ?, Phone = ?, Email = ?, HospitalId = ?, Password = ? WHERE DoctorId = ?",
      [
        doctor.FirstName,
        doctor.LastName,
        doctor.Gender,
        doctor.Rating,
        doctor.Price,
        doctor.Phone,
        doctor.Email,
        doctor.HospitalId,
        doctor.Password,
        doctor.DoctorId,
      ]
    );
    return this.findByIdAsync(doctor.DoctorId) as Promise<Doctor>;
  }

  async addAvailabilityAsync(
    doctorId: number,
    startDate: string,
    endDate: string
  ): Promise<void> {
    await this.pool.query("CALL add_availability_for_doctor(?, ?, ?)", [
      doctorId,
      startDate,
      endDate,
    ]);
  }

  async cancelAppointmentAsync(appointmentId: number): Promise<void> {
    await this.pool.query("CALL cancel_doctor_appointment(?)", [appointmentId]);
  }

  async getAppointmentsCompletedToday(doctorId: number): Promise<number> {
    const [rows] = await this.pool.query(
      `SELECT 
          COUNT(a.AppointmentId) AS AppointmentsCompletedToday
       FROM 
          AppointmentDetails a
       JOIN AppointmentStatus s ON a.AppointmentId = s.AppointmentId
       WHERE 
          a.DoctorId = ? AND
          DATE(s.Timestamp) = CURDATE()
          AND s.Status = 'Completed';`,
      [doctorId]
    );
    return (rows as { AppointmentsCompletedToday: number }[])[0]
      .AppointmentsCompletedToday;
  }

  async getAppointmentsPendingToday(doctorId: number): Promise<number> {
    const [rows] = await this.pool.query(
      `SELECT 
          COUNT(a.AppointmentId) AS AppointmentsPendingToday
       FROM 
          AppointmentDetails a
       JOIN AppointmentStatus s ON a.AppointmentId = s.AppointmentId
       WHERE 
          a.DoctorId = ? AND
          DATE(s.Timestamp) = CURDATE()
          AND s.Status = 'Scheduled';`,
      [doctorId]
    );
    return (rows as { AppointmentsPendingToday: number }[])[0]
      .AppointmentsPendingToday;
  }

  async getLabReportsPending(doctorId: number): Promise<LabReportPending[]> {
    const [rows] = await this.pool.query(
      `SELECT 
          od.OrderId,
          ot.AppointmentId,
          d.DoctorId,
          CONCAT(d.FirstName, ' ', d.LastName) AS DoctorName,
          p.PatientId,
          CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
          lt.LabTestId,
          lt.LabTestName,
          lt.Description,
          lt.OptimalRange,
          lt.Price,
          ot.Timestamp AS OrderedTimestamp
       FROM 
          OrderDetails od
       JOIN OrderTimestamp ot ON od.OrderId = ot.OrderId
       JOIN Doctor d ON od.DoctorId = d.DoctorId
       JOIN AppointmentDetails a ON ot.AppointmentId = a.AppointmentId
       JOIN Patient p ON a.PatientId = p.PatientId
       JOIN LabTest lt ON od.LabTestId = lt.LabTestId
       LEFT JOIN LabReport lr ON lr.LabTestId = lt.LabTestId AND lr.PatientId = p.PatientId
       WHERE 
          d.DoctorId = ? AND
          lr.LabTestId IS NULL 
       ORDER BY 
          od.OrderId, ot.Timestamp;`,
      [doctorId]
    );
    return rows as LabReportPending[];
  }

  async getPendingLabReportsCount(doctorId: number): Promise<number> {
    const [rows] = await this.pool.query(
      `SELECT 
          COUNT(*) AS PendingLabReports
       FROM 
          OrderDetails od
       JOIN OrderTimestamp ot ON od.OrderId = ot.OrderId
       JOIN Doctor d ON od.DoctorId = d.DoctorId
       JOIN AppointmentDetails a ON ot.AppointmentId = a.AppointmentId
       JOIN Patient p ON a.PatientId = p.PatientId
       JOIN LabTest lt ON od.LabTestId = lt.LabTestId
       LEFT JOIN LabReport lr ON lr.LabTestId = lt.LabTestId AND lr.PatientId = p.PatientId
       WHERE 
          d.DoctorId = ? AND
          lr.LabTestId IS NULL 
       ORDER BY 
          od.OrderId, ot.Timestamp;`,
      [doctorId]
    );
    return (rows as { PendingLabReports: number }[])[0].PendingLabReports;
  }
}
