import { pool } from "../database/connection.js";
import {
  AtualizarLivroDTO,
  CriarLivroDTO,
  Livro,
  LivroDetalhado,
} from "../models/Livro.js";

interface LivroRow {
  id: number;
  titulo: string;
  autor_id: number;
  isbn: string | null;
  ano_publicacao: number | null;
  quantidade_total: number;
  quantidade_disponivel: number;
}

interface LivroDetalhadoRow extends LivroRow {
  autor_nome: string;
}

export class LivroRepository {
  async create(data: CriarLivroDTO): Promise<Livro> {
    const result = await pool.query<LivroRow>(
      `
        INSERT INTO livros (
        titulo,
        autor_id,
        isbn,
        ano_publicacao,
        quantidade_total,
        quantidade_disponivel
      )
      VALUES ($1, $2, $3, $4, $5, $5)
      RETURNING
       id,
       titulo, 
       autor_id, 
       isbn, 
       ano_publicacao, 
       quantidade_total, 
       quantidade_disponivel
      `,
      [
        data.titulo,
        data.autorId,
        data.isbn ?? null,
        data.anoPublicacao ?? null,
        data.quantidadeTotal,
      ],
    );

    return this.mapRow(result.rows[0]);
  }

  async findAll(): Promise<LivroDetalhado[]> {
    const result = await pool.query<LivroDetalhadoRow>(
      `
        SELECT
        l.id,
        l.titulo,
        l.autor_id,
        a.nome AS autor_nome,
        l.isbn,
        l.ano_publicacao,
        l.quantidade_total,
        l.quantidade_disponivel
        FROM livros AS l
        INNER JOIN autores AS a ON a.id = l.autor_id
        ORDER BY l.titulo
        `,
    );

    return result.rows.map((row) => this.mapDetailedRow(row));
  }

  async findById(id: number): Promise<LivroDetalhado | null> {
    const result = await pool.query<LivroDetalhadoRow>(
      `
        SELECT
        l.id,
        l.titulo,
        l.autor_id,
        a.nome AS autor_nome,
        l.isbn,
        l.ano_publicacao,
        l.quantidade_total,
        l.quantidade_disponivel
        FROM livros AS l
        INNER JOIN autores AS a ON a.id = l.autor_id
        WHERE l.id = $1
        `,
      [id],
    );

    return result.rows[0] ? this.mapDetailedRow(result.rows[0]) : null;
  }

  async update(id: number, data: AtualizarLivroDTO): Promise<Livro | null> {
    const result = await pool.query<LivroRow>(
      `
        UPDATE livros
        SET titulo = $1,
            autor_id = $2,
            isbn = $3,
            ano_publicacao = $4,
            quantidade_total = $5,
            quantidade_disponivel = quantidade_disponivel + ($5 - quantidade_total)
        WHERE id = $6
          AND quantidade_disponivel + ($5 - quantidade_total) >= 0
        RETURNING id, titulo, autor_id, isbn, ano_publicacao, quantidade_total, quantidade_disponivel
      `,
      [
        data.titulo,
        data.autorId,
        data.isbn ?? null,
        data.anoPublicacao ?? null,
        data.quantidadeTotal,
        id,
      ],
    );

    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(`DELETE FROM livros WHERE id = $1`, [id]);

    return result.rowCount === 1;
  }

  private mapRow(row: LivroRow): Livro {
    return new Livro(
      row.id,
      row.titulo,
      row.autor_id,
      row.isbn,
      row.ano_publicacao,
      row.quantidade_total,
      row.quantidade_disponivel,
    );
  }

  private mapDetailedRow(row: LivroDetalhadoRow): LivroDetalhado {
    return {
      ...this.mapRow(row),
      autorNome: row.autor_nome,
    };
  }
}
