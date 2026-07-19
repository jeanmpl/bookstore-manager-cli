import { AppError } from "./AppError.js";

export function requireText(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new AppError(`${fieldName} é obrigatório.`);
  }

  return normalized;
}

export function requirePositiveInteger(
  value: number,
  fieldName: string,
): number {
  if (!Number.isInteger(value) || value <= 0) {
    throw new AppError(
      `${fieldName} deve ser um número inteiro maior que zero.`,
    );
  }

  return value;
}

export function validateEmail(value: string): string {
  const normalized = value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalized)) {
    throw new AppError("O e-mail informado é inválido.");
  }

  return normalized;
}

export function validateYear(year: number | null): number | null {
  if (year === null) {
    return null;
  }

  if (!Number.isInteger(year) || year < 1000 || year > 2100) {
    throw new AppError("Ano de publicação deve estar entre 1000 e 2100.");
  }

  return year;
}
