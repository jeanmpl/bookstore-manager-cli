import { AutorController } from "../controllers/AutorController.js";
import { ClienteController } from "../controllers/ClienteController.js";
import { ConsoleInput } from "../utils/ConsoleInput.js";

export class MainMenu {
  constructor(
    private readonly input: ConsoleInput,
    private readonly authorController: AutorController,
    private readonly clientController: ClienteController,
  ) {}

  async run(): Promise<void> {
    let running = true;

    while (running) {
      console.log("\n================================");
      console.log("     BOOKSTORE MANAGER CLI");
      console.log("================================");
      console.log("1. Autores");
      console.log("2. Livros");
      console.log("3. Clientes");
      console.log("4. Emprestimos");
      console.log("5. Relatórios");
      console.log("0. Encerrar sessão");

      const option = await this.input.ask("\nEscolha uma opção: ");

      switch (option) {
        case "1":
          await this.authorController.run();
          break;
        case "2":
          console.log("Funcionalidade de livros ainda não implementada.");
          break;
        case "3":
          await this.clientController.run();
          break;
        case "4":
          console.log("Funcionalidade de empréstimos ainda não implementada.");
          break;
        case "5":
          console.log("Funcionalidade de relatórios ainda não implementada.");
          break;
        case "0":
          running = false;
          console.log("Encerrando sessão...");
          break;
        default:
          console.log("Opção inválida. Tente novamente.");
      }
    }
  }
}
