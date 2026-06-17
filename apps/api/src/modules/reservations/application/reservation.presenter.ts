import { ReservationSummary } from "@hospedex/contracts";
import { Reservation } from "../domain/reservation.entity";

export class ReservationPresenter {
  static summary(reservation: Reservation, roomTypeName = "Categoria", roomNumber?: string): ReservationSummary {
    const snapshot = reservation.snapshot;
    return {
      id: snapshot.id,
      tenantId: snapshot.tenantId,
      code: snapshot.code,
      guestName: snapshot.guestName,
      roomTypeName,
      roomNumber,
      checkInDate: snapshot.period.checkInDate.toISOString().slice(0, 10),
      checkOutDate: snapshot.period.checkOutDate.toISOString().slice(0, 10),
      adults: snapshot.adults,
      children: snapshot.children,
      status: snapshot.status,
      origin: snapshot.origin,
      totalAmount: snapshot.totalAmount.amount
    };
  }
}
