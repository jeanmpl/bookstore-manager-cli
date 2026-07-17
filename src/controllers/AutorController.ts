import { AutorService } from "../services/AutorService.js";
import { ConsoleInput } from "../utils/ConsoleInput.js";
import { getFriendlyErrorMessage } from "../utils/AppError.js";

export class AutorController {
  constructor(
    private readonly service: AutorService,
    private readonly input: ConsoleInput,
  ) {}

  async run(): Promise<void> {
    let running = true;

    while (running) {
      console.log("\n=== AUTORES ===");
      console.log("1. Criar autor");
      console.log("2. Listar autores");
      console.log("3. Consultar autor por ID");
      console.log("4. Atualizar autor");
      console.log("5. Deletar autor");
      console.log("0. Voltar");

      const option = await this.input.ask("\nEscolha uma opção: ");

      try {
        switch (option) {
          case "1":
            await this.create();
            break;
          case "2":
            await this.list();
            break;
          case "3":
            await this.getById();
            break;
          case "4":
            await this.update();
            break;
          case "5":
            await this.delete();
            break;
          case "0":
            running = false;
            break;
          default:
            console.log("Opção inválida. Tente novamente.");
        }
      } catch (error) {
        console.log(`Erro: ${getFriendlyErrorMessage(error)}`);
      }

      await this.input.pause();
    }
  }

  private async create(): Promise<void> {
    const nome = await this.input.askRequired("Nome do autor: ");
    const nacionalidade = await this.input.ask(
      "Nacionalidade do autor (opcional): ",
    );

    const autor = await this.service.create({ nome, nacionalidade });
    console.log(
      `Autor cadastrado com sucesso! ID: ${autor.id}, Nome: ${autor.nome}`,
    );
  }

  private async list(): Promise<void> {
    const autores = await this.service.findAll();
    console.table(autores);
  }

  private async getById(): Promise<void> {
    const id = await this.input.askNumber("ID do autor: ");
    const autor = await this.service.findById(id);
    console.table([autor]);
  }

  private async update(): Promise<void> {
    const id = await this.input.askNumber("ID do autor a ser atualizado: ");
    const current = await this.service.findById(id);

    const nome = await this.input.ask(`Nome [${current.nome}]: `);
    const nacionalidade = await this.input.ask(
      `Nacionalidade [${current.nacionalidade ?? "vazio"}]: `,
    );

    const updated = await this.service.update(id, {
      nome: nome || current.nome,
      nacionalidade: nacionalidade.trim() || current.nacionalidade || null,
    });

    console.log(
      `Autor atualizado com sucesso! ID: ${updated.id}, Nome: ${updated.nome}`,
    );
  }

  private async delete(): Promise<void> {
    const id = await this.input.askNumber("ID do autor a ser deletado: ");
    await this.service.delete(id);
    console.log("Autor removido com sucesso.");
  }
}
