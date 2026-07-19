import { pool } from "../database/connection.js";
import {
  CriarEmprestimoDTO,
  Emprestimo,
  EmprestimoDetalhado,
  StatusEmprestimo,
} from "../models/Emprestimo.js";

interface EmprestimoRow {
  id: number;
  cliente_id: number;
  livro_id: number;
  data_emprestimo: Date;
  data_prevista_devolucao: string;
  data_devolucao: Date | null;
  status: StatusEmprestimo;
}

interface EmprestimoDetalhadoRow {
  id: number;
  cliente_nome: string;
  livro_titulo: string;
  data_emprestimo: Date;
  data_prevista_devolucao: string;
  data_devolucao: Date | null;
  status: StatusEmprestimo;
}

export class EmprestimoRepository {
  async create(data: CriarEmprestimoDTO): Promise<Emprestimo | null> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const availabilityResult = await client.query(
        `
          UPDATE livros
          SET quantidade_disponivel = quantidade_disponivel - 1
          WHERE id = $1
            AND quantidade_disponivel > 0
        `,
        [data.livroId],
      );

      if (availabilityResult.rowCount !== 1) {
        await client.query("ROLLBACK");
        return null;
      }

      const loanResult = await client.query<EmprestimoRow>(
        `
          INSERT INTO emprestimos (
            cliente_id,
            livro_id
          )
          VALUES ($1, $2)
          RETURNING
          id,
          cliente_id,
          livro_id,
          data_emprestimo,
          data_prevista_devolucao,
          data_devolucao,
          status
        `,
        [data.clienteId, data.livroId],
      );

      await client.query("COMMIT");

      return this.mapRow(loanResult.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<EmprestimoDetalhado[]> {
    const result = await pool.query<EmprestimoDetalhadoRow>(
      `
        SELECT
          e.id,
          c.nome AS cliente_nome,
          l.titulo AS livro_titulo,
          e.data_emprestimo,
          e.data_prevista_devolucao,
          e.data_devolucao,
          e.status
        FROM emprestimos AS e
        INNER JOIN clientes AS c ON c.id = e.cliente_id
        INNER JOIN livros AS l ON l.id = e.livro_id
        ORDER BY e.data_emprestimo DESC
      `,
    );

    return result.rows.map((row) => ({
      id: row.id,
      clienteNome: row.cliente_nome,
      livroTitulo: row.livro_titulo,
      dataEmprestimo: row.data_emprestimo,
      dataPrevistaDevolucao: row.data_prevista_devolucao,
      dataDevolucao: row.data_devolucao,
      status: row.status,
    }));
  }

  async findById(id: number): Promise<Emprestimo | null> {
    const result = await pool.query<EmprestimoRow>(
      `
        SELECT
          id,
          cliente_id,
          livro_id,
          data_emprestimo,
          data_prevista_devolucao,
          data_devolucao,
          status
        FROM emprestimos
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  async returnBook(id: number): Promise<boolean> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const loanResult = await client.query<{ livro_id: number }>(
        `
          UPDATE emprestimos
          SET status = 'devolvido',
              data_devolucao = CURRENT_TIMESTAMP
          WHERE id = $1
            AND status = 'ativo'
          RETURNING livro_id
        `,
        [id],
      );

      if (!loanResult.rows[0]) {
        await client.query("ROLLBACK");
        return false;
      }

      await client.query(
        `
          UPDATE livros
          SET quantidade_disponivel = quantidade_disponivel + 1
          WHERE id = $1
        `,
        [loanResult.rows[0].livro_id],
      );

      await client.query("COMMIT");
      return true;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  private mapRow(row: EmprestimoRow): Emprestimo {
    return new Emprestimo(
      row.id,
      row.cliente_id,
      row.livro_id,
      row.data_emprestimo,
      row.data_prevista_devolucao,
      row.data_devolucao,
      row.status,
    );
  }
}
