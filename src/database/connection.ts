import "dotenv/config";
import { Pool } from "pg";

const requiredVariables = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
];

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function testDatabaseConnection(): Promise<void> {
  for (const variable of requiredVariables) {
    if (!process.env[variable]) {
      throw new Error(`Variável de ambiente ausente: ${variable}`);
    }
  }

  const client = await pool.connect();

  try {
    await client.query("SELECT 1");
  } finally {
    client.release();
  }
}
