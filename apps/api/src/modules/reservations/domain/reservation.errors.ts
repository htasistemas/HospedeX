export class ReservationDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReservationDomainError";
  }
}
