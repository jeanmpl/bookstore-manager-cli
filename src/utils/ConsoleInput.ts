import { stdin as input, stdout as output } from "node:process";
import { createInterface, Interface } from "node:readline/promises";
import { AppError } from "./AppError.js";

export class ConsoleInput {
  private readonly readline: Interface;

  constructor() {
    this.readline = createInterface({ input, output });
  }

  async ask(message: string): Promise<string> {
    return (await this.readline.question(message)).trim();
  }

  async askRequired(message: string): Promise<string> {
    const value = await this.ask(message);

    if (!value) {
      throw new AppError("O valor informado é obrigatório.");
    }

    return value;
  }

  async askNumber(message: string): Promise<number> {
    const value = await this.askRequired(message);
    const numberValue = Number(value);

    if (!Number.isInteger(numberValue)) {
      throw new AppError("Informe um número inteiro válido.");
    }

    return numberValue;
  }

  async askOptionalNumber(message: string): Promise<number | null> {
    const value = await this.ask(message);

    if (!value) {
      return null;
    }

    const numberValue = Number(value);

    if (!Number.isInteger(numberValue)) {
      throw new AppError("Informe um número inteiro válido.");
    }

    return numberValue;
  }

  async pause(): Promise<void> {
    await this.ask("Pressione ENTER para continuar...");
  }

  close(): void {
    this.readline.close();
  }
}
