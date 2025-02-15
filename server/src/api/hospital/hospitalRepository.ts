import mysql from "mysql2/promise";
import { env } from "@/common/utils/envConfig";
import type {
  FindAllWithPaginationSchema,
  Hospital,
  RowCountQuerySchema,
  Transaction,
} from "@/api/models/hospitalModel";

export class HospitalRepository {
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
      "SELECT * FROM Hospital LIMIT ? OFFSET ?",
      [limit, offset]
    );
    const [countRows] = await this.pool.query(
      "SELECT COUNT(*) as total FROM Hospital"
    );
    const total = (countRows as RowCountQuerySchema[])[0].total;
    return {
      hospitals: rows as Hospital[],
      totalRows: total,
    };
  }

  async findByIdAsync(id: number): Promise<Hospital | null> {
    const [rows] = await this.pool.query(
      "SELECT * FROM Hospital WHERE HospitalId = ?",
      [id]
    );
    const hospitals = rows as Hospital[];
    return hospitals.length > 0 ? hospitals[0] : null;
  }

  async getTransactionsByHospitalIdAsync(
    hospitalId: number
  ): Promise<Transaction[]> {
    const [rows] = await this.pool.query(
      `SELECT 
          t.TransactionId,
          t.Timestamp,
          t.Amount,
          t.Mode,
          p.PatientId,
          p.FirstName AS PatientFirstName,
          p.LastName AS PatientLastName,
          h.HospitalName
      FROM 
          Transaction t
      JOIN 
          Hospital h ON t.HospitalId = h.HospitalId
      JOIN 
          Patient p ON t.PatientId = p.PatientId
      WHERE 
          t.HospitalId = ?`,
      [hospitalId]
    );
    return rows as Transaction[];
  }
}
