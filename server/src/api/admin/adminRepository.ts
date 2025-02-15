import mysql from "mysql2/promise";
import { env } from "@/common/utils/envConfig";
import type {
  AdminLogin,
  AverageDoctorsRatingPerHospitalQueryResult,
  PatientsByDoctorRatingQueryResult,
  PatientsByTopQualifiedDoctors,
  FrequentCustomers,
  PatientCoordinateCount,
  TotalAppointmentsToday,
  TotalDoctors,
  TotalHospitals,
} from "@/api/models/adminModel";

export class AdminRepository {
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

  async findPatientsByDoctorRating(
    rating: number
  ): Promise<PatientsByDoctorRatingQueryResult[]> {
    const [rows] = await this.pool.query(
      `((SELECT p.FirstName, p.LastName, p.Gender, p.Email, p.Phone FROM
        AppointmentDetails as a JOIN Patient as p ON p.PatientId = a.PatientId
        GROUP BY p.PatientId
        HAVING COUNT(*) >= 1
        ORDER BY COUNT(*) desc
        LIMIT 100)
      INTERSECT
      (SELECT p.FirstName, p.LastName, p.Gender, p.Email, p.Phone FROM
        (AppointmentDetails as a JOIN Patient as p ON p.PatientId = a.PatientId) JOIN Doctor as d
        on d.DoctorId = a.DoctorId
        WHERE d.Rating >= ?))`,
      [rating]
    );
    return rows as PatientsByDoctorRatingQueryResult[];
  }

  async findPatientsByTopQualifiedDoctors(
    rating: number
  ): Promise<PatientsByTopQualifiedDoctors[]> {
    const [rows] = await this.pool.query(
      `SELECT p.FirstName, p.LastName, p.Gender, p.Email, p.Phone FROM
        (AppointmentDetails as a JOIN Patient as p ON p.PatientId = a.PatientId) 
        JOIN Doctor as d on d.DoctorId = a.DoctorId
        WHERE d.Rating >= ?`,
      [rating]
    );
    return rows as PatientsByTopQualifiedDoctors[];
  }

  async getDoctorsCountPerHospital(): Promise<
    AverageDoctorsRatingPerHospitalQueryResult[]
  > {
    const [rows] = await this.pool.query(
      `SELECT h.HospitalName, COUNT(*) as DocCount, AVG(h.Rating) as AverageHospitalRating
        FROM Hospital as h JOIN Doctor as d ON h.HospitalId = d.HospitalId
        GROUP BY h.HospitalName
        HAVING COUNT(*) >= 1
        ORDER BY h.HospitalName ASC;`,
      []
    );
    return rows as AverageDoctorsRatingPerHospitalQueryResult[];
  }

  public async createAdminUser(email: string, hashedPassword: string) {
    const query = "INSERT INTO AdminLogin (Email, Password) VALUES (?, ?)";
    await this.pool.execute(query, [email, hashedPassword]);
  }

  public async authenticateAdminUser(email: string, hashedPassword: string) {
    const query =
      "SELECT Email FROM AdminLogin WHERE Email = ? AND Password = ?";
    const [rows] = await this.pool.query(query, [email, hashedPassword]);
    return rows as AdminLogin[];
  }

  public async isEmailExists(email: string): Promise<boolean> {
    const query = "SELECT COUNT(*) as count FROM AdminLogin WHERE Email = ?";
    const [rows] = await this.pool.query(query, [email]);
    const result = rows as { count: number }[];
    return result[0]?.count > 0;
  }

  async findFrequentCustomers(): Promise<FrequentCustomers[]> {
    const [rows] = await this.pool.query(
      `SELECT p.FirstName, p.LastName, p.Gender, COUNT(*) as NumberOfBookings FROM
        AppointmentDetails as a JOIN Patient as p ON p.PatientId = a.PatientId
        GROUP BY p.PatientId
        HAVING COUNT(*) >= 1
        ORDER BY COUNT(*) desc`
    );
    return rows as FrequentCustomers[];
  }

  async getPatientCoordinateCounts(
    startTime: string,
    endTime: string,
    allergyPattern: string
  ): Promise<PatientCoordinateCount[]> {
    const [rows] = await this.pool.query(
      "CALL GetPatientCoordinateCounts(?, ?, ?)",
      [startTime, endTime, allergyPattern]
    );
    return rows as PatientCoordinateCount[];
  }

  async getTotalAppointmentsToday(): Promise<TotalAppointmentsToday> {
    type result = { TotalAppointmentsToday: number }[];
    const [rows] = await this.pool.query(
      `SELECT 
          COUNT(a.AppointmentId) AS TotalAppointmentsToday
        FROM 
          AppointmentDetails a
        JOIN AppointmentStatus s ON a.AppointmentId = s.AppointmentId
        WHERE 
          DATE(s.Timestamp) = CURDATE();`
    );
    const res = rows as result;
    return res[0] as TotalAppointmentsToday;
  }

  async getTotalDoctors(): Promise<TotalDoctors> {
    type result = { TotalDoctors: number }[];
    const [rows] = await this.pool.query(
      `SELECT 
          COUNT(DISTINCT d.DoctorId) AS TotalDoctors
        FROM 
          Doctor d;`
    );
    const res = rows as result;
    return res[0] as TotalDoctors;
  }

  async getTotalHospitals(): Promise<TotalHospitals> {
    type result = { TotalHospitals: number }[];
    const [rows] = await this.pool.query(
      `SELECT 
          COUNT(DISTINCT h.HospitalId) AS TotalHospitals
        FROM 
          Hospital h;`
    );
    const res = rows as result;
    return res[0] as TotalHospitals;
  }
}
