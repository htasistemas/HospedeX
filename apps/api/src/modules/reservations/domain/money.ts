import { ReservationDomainError } from "./reservation.errors";

export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: string
  ) {}

  static brl(amount: number): Money {
    return Money.create(amount, "BRL");
  }

  static create(amount: number, currency: string): Money {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new ReservationDomainError("Valor monetario deve ser positivo.");
    }
    return new Money(Number(amount.toFixed(2)), currency);
  }
}
