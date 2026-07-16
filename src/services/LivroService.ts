import {
  AtualizarLivroDTO,
  CriarLivroDTO,
  Livro,
  LivroDetalhado,
} from "../models/Livro.js";
import { AutorRepository } from "../repositories/AutorRepository.js";
import { LivroRepository } from "../repositories/LivroRepository.js";
import { AppError } from "../utils/AppError.js";
import {
  requirePositiveInteger,
  requireText,
  validateYear,
} from "../utils/validators.js";

export class LivroService {
  constructor(
    private readonly repository: LivroRepository,
    private readonly authorRepository: AutorRepository,
  ) {}

  async create(data: CriarLivroDTO): Promise<Livro> {
    const authorId = requirePositiveInteger(data.autorId, "ID do autor");
    await this.ensureAuthorExists(authorId);

    return this.repository.create({
      titulo: requireText(data.titulo, "Título"),
      autorId: authorId,
      isbn: data.isbn?.trim() || null,
      anoPublicacao: validateYear(data.anoPublicacao ?? null),
      quantidadeTotal: requirePositiveInteger(
        data.quantidadeTotal,
        "Quantidade total",
      ),
    });
  }

  async findAll(): Promise<LivroDetalhado[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<LivroDetalhado> {
    const book = await this.repository.findById(
      requirePositiveInteger(id, "ID do livro"),
    );

    if (!book) {
      throw new AppError("Livro não encontrado");
    }

    return book;
  }

  async update(id: number, data: AtualizarLivroDTO): Promise<Livro> {
    await this.findById(id);

    const authorId = requirePositiveInteger(data.autorId, "ID do autor");
    await this.ensureAuthorExists(authorId);

    const updatedBook = await this.repository.update(id, {
      titulo: requireText(data.titulo, "Título"),
      autorId: authorId,
      isbn: data.isbn?.trim() || null,
      anoPublicacao: validateYear(data.anoPublicacao ?? null),
      quantidadeTotal: requirePositiveInteger(
        data.quantidadeTotal,
        "Quantidade total",
      ),
    });

    if (!updatedBook) {
      throw new AppError(
        "A quantidade total não pode ser menor que a quantidade emprestada",
      );
    }

    return updatedBook;
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);

    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new AppError("Livro não encontrado");
    }
  }

  private async ensureAuthorExists(authorId: number): Promise<void> {
    const author = await this.authorRepository.findById(authorId);

    if (!author) {
      throw new AppError(
        "Autor não encontrado. Cadastre o autor antes de cadastrar o livro.",
      );
    }
  }
}
