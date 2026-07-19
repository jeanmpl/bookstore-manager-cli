import { AutorController } from "./controllers/AutorController.js";
import { ClienteController } from "./controllers/ClienteController.js";
import { EmprestimoController } from "./controllers/EmprestimoController.js";
import { LivroController } from "./controllers/LivroController.js";
import { RelatorioController } from "./controllers/RelatorioController.js";
import { pool, testDatabaseConnection } from "./database/connection.js";
import { MainMenu } from "./menus/MainMenu.js";
import { AutorRepository } from "./repositories/AutorRepository.js";
import { ClienteRepository } from "./repositories/ClienteRepository.js";
import { EmprestimoRepository } from "./repositories/EmprestimoRepository.js";
import { LivroRepository } from "./repositories/LivroRepository.js";
import { RelatorioRepository } from "./repositories/RelatorioRepository.js";
import { AutorService } from "./services/AutorService.js";
import { ClienteService } from "./services/ClienteService.js";
import { EmprestimoService } from "./services/EmprestimoService.js";
import { LivroService } from "./services/LivroService.js";
import { RelatorioService } from "./services/RelatorioService.js";
import { ConsoleInput } from "./utils/ConsoleInput.js";
import { getFriendlyErrorMessage } from "./utils/AppError.js";

async function main(): Promise<void> {
  console.log("Bookstore Manager CLI");
  const input = new ConsoleInput();

  try {
    await testDatabaseConnection();
    console.log("Conexão com o PostgreSQL realizada.");

    const authorRepository = new AutorRepository();
    const bookRepository = new LivroRepository();
    const clientRepository = new ClienteRepository();
    const loanRepository = new EmprestimoRepository();
    const reportRepository = new RelatorioRepository();

    const authorService = new AutorService(authorRepository);
    const bookService = new LivroService(bookRepository, authorRepository);
    const clientService = new ClienteService(clientRepository);
    const loanService = new EmprestimoService(
      loanRepository,
      bookRepository,
      clientRepository,
    );
    const reportService = new RelatorioService(reportRepository);

    const authorController = new AutorController(authorService, input);
    const bookController = new LivroController(bookService, input);
    const clientController = new ClienteController(clientService, input);
    const loanController = new EmprestimoController(loanService, input);
    const reportController = new RelatorioController(reportService, input);
    const mainMenu = new MainMenu(
      input,
      authorController,
      bookController,
      clientController,
      loanController,
      reportController,
    );

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
