import { ReservationDomainError } from "./reservation.errors";

export class StayPeriod {
  private constructor(
    public readonly checkInDate: Date,
    public readonly checkOutDate: Date
  ) {}

  static create(checkInDate: Date, checkOutDate: Date): StayPeriod {
    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      throw new ReservationDomainError("Datas da hospedagem sao invalidas.");
    }
    if (checkOutDate <= checkInDate) {
      throw new ReservationDomainError("Data de saida deve ser posterior a entrada.");
    }
    return new StayPeriod(checkInDate, checkOutDate);
  }

  overlaps(other: StayPeriod): boolean {
    return this.checkInDate < other.checkOutDate && other.checkInDate < this.checkOutDate;
  }

  get nights(): number {
    return Math.ceil((this.checkOutDate.getTime() - this.checkInDate.getTime()) / 86_400_000);
  }
}
