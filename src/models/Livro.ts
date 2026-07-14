export interface CriarLivroDTO {
  titulo: string;
  autorId: number;
  isbn?: string | null;
  anoPublicacao?: number | null;
  quantidadeTotal: number;
}

export interface AtualizarLivroDTO {
  titulo: string;
  autorId: number;
  isbn?: string | null;
  anoPublicacao?: number | null;
  quantidadeTotal: number;
}

export class Livro {
  constructor(
    public readonly id: number,
    public titulo: string,
    public autorId: number,
    public isbn: string | null,
    public anoPublicacao: number | null,
    public quantidadeTotal: number,
  ) {}
}

export interface LivroDetalhado extends Livro {
  autorNome: string;
}
