export interface CriarAutorDTO {
  nome: string;
  nacionalidade?: string | null;
}

export interface AtualizarAutorDTO {
  nome: string;
  nacionalidade?: string | null;
}

export class Autor {
  constructor(
    public readonly id: number,
    public nome: string,
    public nacionalidade: string | null,
  ) {}
}
