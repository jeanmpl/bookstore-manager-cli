import { EmprestimoService } from "../services/EmprestimoService.js";
import { getFriendlyErrorMessage } from "../utils/AppError.js";
import { ConsoleInput } from "../utils/ConsoleInput.js";

export class EmprestimoController {
  constructor(
    private readonly service: EmprestimoService,
    private readonly input: ConsoleInput,
  ) {}

  async run(): Promise<void> {
    let running = true;

    while (running) {
      console.log("\n================================");
      console.log("     EMPRÉSTIMOS");
      console.log("================================");
      console.log("1. Registrar empréstimo");
      console.log("2. Registrar devolução");
      console.log("3. Listar empréstimos");
      console.log("0. Voltar ao menu principal");

      const option = await this.input.ask("\nEscolha uma opção: ");

      try {
        switch (option) {
          case "1":
            await this.create();
            break;
          case "2":
            await this.returnBook();
            break;
          case "3":
            await this.list();
            break;
          case "0":
            running = false;
            continue;
          default:
            console.log("Opção inválida.");
        }
      } catch (error) {
        console.log(`Erro: ${getFriendlyErrorMessage(error)}`);
      }

      await this.input.pause();
    }
  }

  private async create(): Promise<void> {
    const clienteId = await this.input.askNumber("ID do cliente: ");
    const livroId = await this.input.askNumber("ID do livro: ");

    const loan = await this.service.create({
      clienteId,
      livroId,
    });

    console.log(`Empréstimo registrado com sucesso! ID: ${loan.id}`);
    console.log(
      `Data prevista para devolução: ${loan.dataPrevistaDevolucao} (prazo padrão de 30 dias)`,
    );
  }

  private async returnBook(): Promise<void> {
    const id = await this.input.askNumber("ID do empréstimo: ");
    await this.service.returnBook(id);
    console.log("Livro devolvido com sucesso!");
  }

  private async list(): Promise<void> {
    const loans = await this.service.findAll();
    console.table(loans);
  }
}
