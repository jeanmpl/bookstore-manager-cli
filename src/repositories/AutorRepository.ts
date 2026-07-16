import { pool } from "../database/connection.js";
import { AtualizarAutorDTO, Autor, CriarAutorDTO } from "../models/Autor.js";

interface AutorRow {
  id: number;
  nome: string;
  nacionalidade: string | null;
}

export class AutorRepository {
  async create(data: CriarAutorDTO): Promise<Autor> {
    const result = await pool.query<AutorRow>(
      `
        INSERT INTO autores (nome, nacionalidade)
        VALUES ($1, $2)
        RETURNING id, nome, nacionalidade      
      `,
      [data.nome, data.nacionalidade ?? null],
    );

    return this.mapRow(result.rows[0]);
  }

  async findAll(): Promise<Autor[]> {
    const result = await pool.query<AutorRow>(
      `
        SELECT id, nome, nacionalidade
        FROM autores
        ORDER BY nome
      `,
    );

    return result.rows.map((row) => this.mapRow(row));
  }

  async findById(id: number): Promise<Autor | null> {
    const result = await pool.query<AutorRow>(
      `
        SELECT id, nome, nacionalidade
        FROM autores
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  async update(id: number, data: AtualizarAutorDTO): Promise<Autor | null> {
    const result = await pool.query<AutorRow>(
      `
        UPDATE autores
        SET nome = $1, nacionalidade = $2
        WHERE id = $3
        RETURNING id, nome, nacionalidade
      `,
      [data.nome, data.nacionalidade ?? null, id],
    );

    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(`DELETE FROM autores WHERE id = $1`, [id]);
    return result.rowCount === 1;
  }

  private mapRow(row: AutorRow): Autor {
    return new Autor(row.id, row.nome, row.nacionalidade);
  }
}
