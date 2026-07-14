import { pool, testDatabaseConnection } from "./database/connection.js";

async function main(): Promise<void> {
  console.log("Bookstore Manager CLI");
  try {
    await testDatabaseConnection();
    console.log("Conexão com a base de dados realizada.");
  } finally {
    await pool.end();
  }
}

main();
