import { pool, testDatabaseConnection } from "./database/connection.js";
import { ConsoleInput } from "./utils/ConsoleInput.js";

async function main(): Promise<void> {
  console.log("Bookstore Manager CLI");
  try {
    await testDatabaseConnection();
    console.log("Conexão com a base de dados realizada.");
  } finally {
    await pool.end();
  }

  const input = new ConsoleInput();

  try {
    const nome = await input.askRequired("Nome: ");
    console.log(nome);
  } finally {
    input.close();
  }
}

main();
