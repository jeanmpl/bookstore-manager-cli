export interface CriarClienteDTO {
  nome: string;
  email: string;
  telefone?: string | null;
}

export interface AtualizarClienteDTO {
  nome: string;
  email: string;
  telefone?: string | null;
}

export class Cliente {
  constructor(
    public readonly id: number,
    public nome: string,
    public email: string,
    public telefone: string | null,
  ) {}
}
