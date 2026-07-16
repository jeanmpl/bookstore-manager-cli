import { pool, testDatabaseConnection } from "./database/connection.js";
import { ConsoleInput } from "./utils/ConsoleInput.js";
import { AutorRepository } from "./repositories/AutorRepository.js";
import { AutorService } from "./services/AutorService.js";
import { AutorController } from "./controllers/AutorController.js";
import { MainMenu } from "./menus/MainMenu.js";
import { getFriendlyErrorMessage } from "./utils/AppError.js";

async function main(): Promise<void> {
  console.log("Bookstore Manager CLI");
  const input = new ConsoleInput();

  try {
    await testDatabaseConnection();
    console.log("Conexão com o PostgreSQL realizada.");

    const authorRepository = new AutorRepository();
    const authorService = new AutorService(authorRepository);
    const authorController = new AutorController(authorService, input);
    const mainMenu = new MainMenu(input, authorController);

    await mainMenu.run();
    console.log("Sessão encerrada. Até logo!");
  } catch (error) {
    console.error(
      `Falha ao iniciar a aplicação: ${getFriendlyErrorMessage(error)}`,
    );
  } finally {
    input.close();
    await pool.end();
  }
}

main();
