import { pool } from "../database/connection.js";
import {
  AtualizarClienteDTO,
  Cliente,
  CriarClienteDTO,
} from "../models/Cliente.js";

interface ClienteRow {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
}

export class ClienteRepository {
  async create(data: CriarClienteDTO): Promise<Cliente> {
    const result = await pool.query<ClienteRow>(
      `
        INSERT INTO clientes (nome, email, telefone)
        VALUES ($1, $2, $3)
        RETURNING id, nome, email, telefone
      `,
      [data.nome, data.email, data.telefone ?? null],
    );

    return this.mapRow(result.rows[0]);
  }

  async findAll(): Promise<Cliente[]> {
    const result = await pool.query<ClienteRow>(
      `
        SELECT id, nome, email, telefone
        FROM clientes
        ORDER BY nome
      `,
    );

    return result.rows.map((row) => this.mapRow(row));
  }

  async findById(id: number): Promise<Cliente | null> {
    const result = await pool.query<ClienteRow>(
      `
        SELECT id, nome, email, telefone
        FROM clientes
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  async update(id: number, data: AtualizarClienteDTO): Promise<Cliente | null> {
    const result = await pool.query<ClienteRow>(
      `
        UPDATE clientes
        SET nome = $1,
            email = $2,
            telefone = $3
        WHERE id = $4
        RETURNING id, nome, email, telefone
      `,
      [data.nome, data.email, data.telefone ?? null, id],
    );

    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(`DELETE FROM clientes WHERE id = $1`, [id]);

    return result.rowCount === 1;
  }

  private mapRow(row: ClienteRow): Cliente {
    return new Cliente(row.id, row.nome, row.email, row.telefone);
  }
}
