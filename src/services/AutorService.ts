import { AtualizarAutorDTO, Autor, CriarAutorDTO } from "../models/Autor.js";
import { AutorRepository } from "../repositories/AutorRepository.js";
import { AppError } from "../utils/AppError.js";
import { requirePositiveInteger, requireText } from "../utils/validators.js";

export class AutorService {
  constructor(private readonly repository: AutorRepository) {}

  async create(data: CriarAutorDTO): Promise<Autor> {
    return this.repository.create({
      nome: requireText(data.nome, "Nome"),
      nacionalidade: data.nacionalidade || null,
    });
  }

  async findAll(): Promise<Autor[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Autor> {
    const autor = await this.repository.findById(
      requirePositiveInteger(id, "ID do autor"),
    );

    if (!autor) {
      throw new AppError("Autor não encontrado.");
    }

    return autor;
  }

  async update(id: number, data: AtualizarAutorDTO): Promise<Autor> {
    await this.findById(id);

    const updatedAutor = await this.repository.update(id, {
      nome: requireText(data.nome, "Nome"),
      nacionalidade: data.nacionalidade?.trim() || null,
    });

    if (!updatedAutor) {
      throw new AppError("Autor não encontrado.");
    }

    return updatedAutor;
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);

    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new AppError("Autor não encontrado.");
    }
  }
}
