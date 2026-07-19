import {
  ClienteComEmprestimoAtivoReport,
  EmprestimosPorLivroReport,
  LivroDisponivelReport,
  LivroEmprestadoReport,
  LivrosPorAutorReport,
  RelatorioRepository,
} from "../repositories/RelatorioRepository.js";

export class RelatorioService {
  constructor(private readonly repository: RelatorioRepository) {}

  async findAvailableBooks(): Promise<LivroDisponivelReport[]> {
    return this.repository.findAvailableBooks();
  }

  async findBorrowedBooks(): Promise<LivroEmprestadoReport[]> {
    return this.repository.findBorrowedBooks();
  }

  async countBooksByAuthor(): Promise<LivrosPorAutorReport[]> {
    return this.repository.countBooksByAuthor();
  }

  async countLoansByBook(): Promise<EmprestimosPorLivroReport[]> {
    return this.repository.countLoansByBook();
  }

  async findClientsWithActiveLoans(): Promise<
    ClienteComEmprestimoAtivoReport[]
  > {
    return this.repository.findClientsWithActiveLoans();
  }
}
