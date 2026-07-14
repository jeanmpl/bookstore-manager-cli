export type StatusEmprestimo = "ativo" | "inativo";

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
    public dataPrevistaDevolucao: Date,
    public dataDevolucao: Date | null,
    public status: StatusEmprestimo,
  ) {}
}

export interface EmprestimoDetalhado {
  id: number;
  clienteNome: string;
  livroTitulo: string;
  dataEmprestimo: Date;
  dataPrevistaDevolucao: Date;
  dataDevolucao: Date | null;
  status: StatusEmprestimo;
}
