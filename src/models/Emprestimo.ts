export type StatusEmprestimo = "ativo" | "devolvido";

export interface CriarEmprestimoDTO {
  clienteId: number;
  livroId: number;
}

export class Emprestimo {
  constructor(
    public readonly id: number,
    public clienteId: number,
    public livroId: number,
    public dataEmprestimo: Date,
    public dataPrevistaDevolucao: string,
    public dataDevolucao: Date | null,
    public status: StatusEmprestimo,
  ) {}
}

export interface EmprestimoDetalhado {
  id: number;
  clienteNome: string;
  livroTitulo: string;
  dataEmprestimo: Date;
  dataPrevistaDevolucao: string;
  dataDevolucao: Date | null;
  status: StatusEmprestimo;
}
