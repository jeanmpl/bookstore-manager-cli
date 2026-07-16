export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}

interface DatabaseError {
  code?: string;
}

export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  const databaseError = error as DatabaseError;

  switch (databaseError.code) {
    case "23505":
      return "Já existe um registro com um valor que deve ser único.";
    case "23503":
      return "O registro não pode ser removido porque está relacionado a outro cadastro.";
    case "23514":
      return "Os dados informados violam uma regra de validação do banco de dados.";
    case "22P02":
      return "Um dos valores informados possui formato inválido.";
    default:
      return error instanceof Error
        ? error.message
        : "Ocorreu um erro inesperado.";
  }
}
