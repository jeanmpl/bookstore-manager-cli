import {
  CriarEmprestimoDTO,
  Emprestimo,
  EmprestimoDetalhado,
} from "../models/Emprestimo.js";
import { ClienteRepository } from "../repositories/ClienteRepository.js";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository.js";
import { LivroRepository } from "../repositories/LivroRepository.js";
import { AppError } from "../utils/AppError.js";
import { requirePositiveInteger } from "../utils/validators.js";

export class EmprestimoService {
  constructor(
    private readonly repository: EmprestimoRepository,
    private readonly bookRepository: LivroRepository,
    private readonly clientRepository: ClienteRepository,
  ) {}

  async create(data: CriarEmprestimoDTO): Promise<Emprestimo> {
    const clientId = requirePositiveInteger(data.clienteId, "ID do cliente");
    const bookId = requirePositiveInteger(data.livroId, "ID do livro");

    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new AppError("Cliente não encontrado");
    }

    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new AppError("Livro não encontrado");
    }

    if (book.quantidadeDisponivel <= 0) {
      throw new AppError("Livro indisponível para empréstimo");
    }

    const loan = await this.repository.create({
      clienteId: clientId,
      livroId: bookId,
    });

    if (!loan) {
      throw new AppError(
        "Não foi possível criar o empréstimo. O livro pode não estar disponível.",
      );
    }

    return loan;
  }

  async findAll(): Promise<EmprestimoDetalhado[]> {
    return this.repository.findAll();
  }

  async returnBook(id: number): Promise<void> {
    const loanId = requirePositiveInteger(id, "ID do empréstimo");
    const loan = await this.repository.findById(loanId);

    if (!loan) {
      throw new AppError("Empréstimo não encontrado");
    }

    if (loan.status === "devolvido") {
      throw new AppError("O livro já foi devolvido");
    }

    const returned = await this.repository.returnBook(loanId);
    if (!returned) {
      throw new AppError("Não foi possível registrar a devolução do livro");
    }
  }
}
