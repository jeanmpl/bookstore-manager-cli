import { ClienteService } from "../services/ClienteService.js";
import { getFriendlyErrorMessage } from "../utils/AppError.js";
import { ConsoleInput } from "../utils/ConsoleInput.js";

export class ClienteController {
  constructor(
    private readonly service: ClienteService,
    private readonly input: ConsoleInput,
  ) {}

  async run(): Promise<void> {
    let running = true;

    while (running) {
      console.log("\n=== CLIENTES ===");
      console.log("1. Cadastrar cliente");
      console.log("2. Listar clientes");
      console.log("3. Consultar cliente por ID");
      console.log("4. Atualizar cliente");
      console.log("5. Remover cliente");
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
    const nome = await this.input.askRequired("Nome: ");
    const email = await this.input.askRequired("E-mail: ");
    const telefone = await this.input.ask("Telefone (opcional): ");

    const client = await this.service.create({ nome, email, telefone });
    console.log(`Cliente cadastrado com ID ${client.id}.`);
  }

  private async list(): Promise<void> {
    const clients = await this.service.findAll();
    console.table(clients);
  }

  private async findById(): Promise<void> {
    const id = await this.input.askNumber("ID do cliente: ");
    const client = await this.service.findById(id);
    console.table([client]);
  }

  private async update(): Promise<void> {
    const id = await this.input.askNumber("ID do cliente: ");
    const current = await this.service.findById(id);

    const nome = await this.input.ask(`Nome [${current.nome}]: `);
    const email = await this.input.ask(`E-mail [${current.email}]: `);
    const telefone = await this.input.ask(
      `Telefone [${current.telefone ?? "vazio"}]: `,
    );

    const updated = await this.service.update(id, {
      nome: nome || current.nome,
      email: email || current.email,
      telefone: telefone || current.telefone,
    });

    console.log(`Cliente ${updated.id} atualizado.`);
  }

  private async delete(): Promise<void> {
    const id = await this.input.askNumber("ID do cliente: ");
    await this.service.delete(id);
    console.log("Cliente removido.");
  }
}
