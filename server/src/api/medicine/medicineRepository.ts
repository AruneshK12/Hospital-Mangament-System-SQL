import mysql from "mysql2/promise";
import { env } from "@/common/utils/envConfig";
import type { Medicine } from "@/api/models/medicineModel";

export class MedicineRepository {
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

  async searchMedicinesAsync(searchString: string): Promise<Medicine[]> {
    const [rows] = await this.pool.query(
      "SELECT * FROM Medicine WHERE MedicineName LIKE ? OR Manufacturer LIKE ?",
      [`%${searchString}%`, `%${searchString}%`]
    );
    return rows as Medicine[];
  }
}
