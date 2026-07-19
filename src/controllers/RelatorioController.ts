import { RelatorioService } from "../services/RelatorioService.js";
import { getFriendlyErrorMessage } from "../utils/AppError.js";
import { ConsoleInput } from "../utils/ConsoleInput.js";

export class RelatorioController {
  constructor(
    private readonly service: RelatorioService,
    private readonly input: ConsoleInput,
  ) {}

  async run(): Promise<void> {
    let running = true;

    while (running) {
      console.log("\n===RELATÓRIOS===");
      console.log("1. Livros disponíveis");
      console.log("2. Livros emprestados");
      console.log("3. Livros por autor");
      console.log("4. Quantidade de empréstimos por livro");
      console.log("5. Clientes com empréstimos ativos");
      console.log("0. Voltar ");

      const option = await this.input.ask("\nEscolha uma opção: ");

      try {
        switch (option) {
          case "1":
            console.table(await this.service.findAvailableBooks());
            break;
          case "2":
            console.table(await this.service.findBorrowedBooks());
            break;
          case "3":
            const report = await this.service.countBooksByAuthor();

            console.table(
              report.map((item) => ({
                autor: item.autor,
                quantidade_total_de_livros: item.quantidadeTotalDeLivros,
                nome_do_livro: item.nomeDoLivro,
                quantidade_por_livro: item.quantidadePorLivro,
              })),
            );
            break;
          case "4":
            console.table(await this.service.countLoansByBook());
            break;
          case "5":
            console.table(await this.service.findClientsWithActiveLoans());
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
}
