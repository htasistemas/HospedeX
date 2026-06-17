export class ReservationCode {
  static generate(sequence: number, date = new Date()): string {
    const year = date.getUTCFullYear();
    return `RSV-${year}-${String(sequence).padStart(6, "0")}`;
  }
}
