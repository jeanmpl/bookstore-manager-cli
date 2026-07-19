import { LivroService } from "../services/LivroService.js";
import { getFriendlyErrorMessage } from "../utils/AppError.js";
import { ConsoleInput } from "../utils/ConsoleInput.js";

export class LivroController {
  constructor(
    private readonly service: LivroService,
    private readonly input: ConsoleInput,
  ) {}

  async run(): Promise<void> {
    let running = true;

    while (running) {
      console.log("\n=== LIVROS ===");
      console.log("1. Cadastrar livro");
      console.log("2. Listar livros");
      console.log("3. Consultar livro por ID");
      console.log("4. Atualizar livro");
      console.log("5. Remover livro");
      console.log("0. Voltar");

      const option = await this.input.ask("Escolha uma opção: ");

      try {
        switch (option) {
          case "1":
            await this.create();
            break;
          case "2":
            await this.list();
            break;
          case "3":
            await this.findById();
            break;
          case "4":
            await this.update();
            break;
          case "5":
            await this.delete();
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
    const titulo = await this.input.askRequired("Título: ");
    const autorId = await this.input.askNumber("ID do autor: ");
    const isbn = await this.input.ask("ISBN: ");
    const anoPublicacao = await this.input.askOptionalNumber(
      "Ano de publicação (opcional): ",
    );
    const quantidadeTotal = await this.input.askNumber("Quantidade total: ");

    const book = await this.service.create({
      titulo,
      autorId,
      isbn,
      anoPublicacao,
      quantidadeTotal,
    });

    console.log(`Livro cadastrado com ID ${book.id}.`);
  }

  private async list(): Promise<void> {
    const books = await this.service.findAll();
    console.table(books);
  }

  private async findById(): Promise<void> {
    const id = await this.input.askNumber("ID do livro: ");
    const book = await this.service.findById(id);
    console.table([book]);
  }

  private async update(): Promise<void> {
    const id = await this.input.askNumber("ID do livro: ");
    const current = await this.service.findById(id);

    const titulo = await this.input.ask(`Título [${current.titulo}]: `);
    const autorId = await this.input.askOptionalNumber(
      `ID do autor [${current.autorId}]: `,
    );
    const isbn = await this.input.ask(`ISBN [${current.isbn ?? "vazio"}]: `);
    const anoPublicacao = await this.input.askOptionalNumber(
      `Ano de publicação [${current.anoPublicacao ?? "vazio"}]: `,
    );
    const quantidadeTotal = await this.input.askOptionalNumber(
      `Quantidade total [${current.quantidadeTotal}]: `,
    );

    const updated = await this.service.update(id, {
      titulo: titulo || current.titulo,
      autorId: autorId ?? current.autorId,
      isbn: isbn || current.isbn,
      anoPublicacao: anoPublicacao ?? current.anoPublicacao,
      quantidadeTotal: quantidadeTotal ?? current.quantidadeTotal,
    });

    console.log(`Livro ID ${updated.id} atualizado.`);
  }

  private async delete(): Promise<void> {
    const id = await this.input.askNumber("ID do livro: ");
    await this.service.delete(id);
    console.log(`Livro ID ${id} removido.`);
  }
}
