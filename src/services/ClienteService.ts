import {
  AtualizarClienteDTO,
  Cliente,
  CriarClienteDTO,
} from "../models/Cliente.js";
import { ClienteRepository } from "../repositories/ClienteRepository.js";
import { AppError } from "../utils/AppError.js";
import {
  requirePositiveInteger,
  requireText,
  validateEmail,
} from "../utils/validators.js";

export class ClienteService {
  constructor(private readonly repository: ClienteRepository) {}

  async create(data: CriarClienteDTO): Promise<Cliente> {
    return this.repository.create({
      nome: requireText(data.nome, "Nome"),
      email: validateEmail(data.email),
      telefone: data.telefone?.trim() || null,
    });
  }

  async findAll(): Promise<Cliente[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Cliente> {
    const client = await this.repository.findById(
      requirePositiveInteger(id, "ID do cliente"),
    );

    if (!client) {
      throw new AppError("Cliente não encontrado");
    }

    return client;
  }

  async update(id: number, data: AtualizarClienteDTO): Promise<Cliente> {
    await this.findById(id);

    const updatedClient = await this.repository.update(id, {
      nome: requireText(data.nome, "Nome"),
      email: validateEmail(data.email),
      telefone: data.telefone?.trim() || null,
    });

    if (!updatedClient) {
      throw new AppError("Cliente não encontrado");
    }

    return updatedClient;
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);

    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new AppError("Cliente não encontrado");
    }
  }
}
