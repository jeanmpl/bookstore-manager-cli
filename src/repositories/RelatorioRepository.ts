import { pool } from "../database/connection.js";

export interface LivroDisponivelReport {
  id: number;
  titulo: string;
  autor: string;
  quantidade_disponivel: number;
}

export interface LivroEmprestadoReport {
  emprestimoId: number;
  titulo: string;
  cliente: string;
  dataEmprestimo: string;
  dataPrevistaDevolucao: string;
}

export interface LivrosPorAutorReport {
  autor: string;
  quantidadeTotalDeLivros: number;
  nomeDoLivro: string;
  quantidadePorLivro: number;
}

export interface EmprestimosPorLivroReport {
  titulo: string;
  quantidadeEmprestimos: number;
}

export interface ClienteComEmprestimoAtivoReport {
  cliente: string;
  email: string;
  quantidadeEmprestimosAtivos: number;
}

export class RelatorioRepository {
  async findAvailableBooks(): Promise<LivroDisponivelReport[]> {
    const result = await pool.query<{
      id: number;
      titulo: string;
      autor: string;
      quantidade_disponivel: number;
    }>(
      `
        SELECT
        l.id,
        l.titulo,
        a.nome AS autor,
        l.quantidade_disponivel
        FROM livros AS l
        INNER JOIN autores AS a ON a.id = l.autor_id
        WHERE l.quantidade_disponivel > 0
        ORDER BY l.titulo;
      `,
    );

    return result.rows.map((row) => ({
      id: row.id,
      titulo: row.titulo,
      autor: row.autor,
      quantidade_disponivel: row.quantidade_disponivel,
    }));
  }

  async findBorrowedBooks(): Promise<LivroEmprestadoReport[]> {
    const result = await pool.query<{
      emprestimo_id: number;
      titulo: string;
      cliente: string;
      data_emprestimo: string;
      data_prevista_devolucao: string;
    }>(
      `
        SELECT
        e.id AS emprestimo_id,
        l.titulo,
        c.nome AS cliente,
        e.data_emprestimo,
        e.data_prevista_devolucao
        FROM emprestimos AS e
        INNER JOIN livros AS l ON l.id = e.livro_id
        INNER JOIN clientes AS c ON c.id = e.cliente_id
        WHERE e.status = 'ativo'
        ORDER BY e.data_prevista_devolucao
      `,
    );

    return result.rows.map((row) => ({
      emprestimoId: row.emprestimo_id,
      titulo: row.titulo,
      cliente: row.cliente,
      dataEmprestimo: row.data_emprestimo,
      dataPrevistaDevolucao: row.data_prevista_devolucao,
    }));
  }

  async countBooksByAuthor(): Promise<LivrosPorAutorReport[]> {
    const result = await pool.query<{
      autor: string;
      quantidade_total_de_livros: number;
      nome_do_livro: string;
      quantidade_por_livro: number;
    }>(
      `
        WITH totais_por_autor AS (
          SELECT
            autor_id,
            SUM(quantidade_total) AS quantidade_total_de_livros
          FROM livros
          GROUP BY autor_id
        )
        SELECT
          a.nome AS autor,
          COALESCE(t.quantidade_total_de_livros, 0) 
            AS quantidade_total_de_livros,
          COALESCE(l.titulo, 'Nenhum livro cadastrado') 
            AS nome_do_livro,
          COALESCE(l.quantidade_total, 0)
            AS quantidade_por_livro
        FROM autores AS a
        LEFT JOIN livros AS l ON l.autor_id = a.id
        LEFT JOIN totais_por_autor AS t ON t.autor_id = a.id
        ORDER BY quantidade_total_de_livros DESC, a.nome, l.titulo;
      `,
    );

    return result.rows.map((row) => ({
      autor: row.autor,
      quantidadeTotalDeLivros: Number(row.quantidade_total_de_livros),
      nomeDoLivro: row.nome_do_livro,
      quantidadePorLivro: Number(row.quantidade_por_livro),
    }));
  }

  async countLoansByBook(): Promise<EmprestimosPorLivroReport[]> {
    const result = await pool.query<{
      titulo: string;
      quantidade_emprestimos: number;
    }>(
      `
        SELECT
          l.titulo,
          COUNT(e.id) AS quantidade_emprestimos
        FROM livros AS l
        LEFT JOIN emprestimos AS e ON e.livro_id = l.id
        GROUP BY l.id, l.titulo
        ORDER BY quantidade_emprestimos DESC, l.titulo
        LIMIT 10
      `,
    );

    return result.rows.map((row) => ({
      titulo: row.titulo,
      quantidadeEmprestimos: Number(row.quantidade_emprestimos),
    }));
  }

  async findClientsWithActiveLoans(): Promise<
    ClienteComEmprestimoAtivoReport[]
  > {
    const result = await pool.query<{
      cliente: string;
      email: string;
      quantidade_emprestimos_ativos: number;
    }>(
      `
        SELECT
          c.nome AS cliente,
          c.email,
          COUNT(e.id) AS quantidade_emprestimos_ativos
        FROM clientes AS c
        INNER JOIN emprestimos AS e ON e.cliente_id = c.id
        WHERE e.status = 'ativo'
        GROUP BY c.id, c.nome, c.email
        ORDER BY quantidade_emprestimos_ativos DESC, c.nome
      `,
    );

    return result.rows.map((row) => ({
      cliente: row.cliente,
      email: row.email,
      quantidadeEmprestimosAtivos: Number(row.quantidade_emprestimos_ativos),
    }));
  }
}
