import { Injectable } from "@nestjs/common";
import { ReservationStatus } from "@hospedex/contracts";
import { Reservation } from "../../domain/reservation.entity";
import { ReservationRepository } from "../../domain/reservation.repository";
import { StayPeriod } from "../../domain/stay-period";

@Injectable()
export class InMemoryReservationRepository implements ReservationRepository {
  private readonly reservations = new Map<string, Reservation>();

  async nextSequence(tenantId: string): Promise<number> {
    return [...this.reservations.values()].filter((reservation) => reservation.snapshot.tenantId === tenantId).length + 1;
  }

  async save(reservation: Reservation): Promise<Reservation> {
    this.reservations.set(reservation.snapshot.id, reservation);
    return reservation;
  }

  async findById(tenantId: string, id: string): Promise<Reservation | null> {
    const reservation = this.reservations.get(id);
    return reservation?.snapshot.tenantId === tenantId ? reservation : null;
  }

  async findOverlapping(params: {
    tenantId: string;
    roomId?: string | null;
    roomTypeId?: string;
    period: StayPeriod;
    ignoreReservationId?: string;
    statuses?: ReservationStatus[];
  }): Promise<Reservation[]> {
    return [...this.reservations.values()].filter((reservation) => {
      const snapshot = reservation.snapshot;
      if (snapshot.tenantId !== params.tenantId) return false;
      if (params.ignoreReservationId && snapshot.id === params.ignoreReservationId) return false;
      if (params.roomId && snapshot.roomId !== params.roomId) return false;
      if (params.roomTypeId && snapshot.roomTypeId !== params.roomTypeId) return false;
      if (params.statuses?.length && !params.statuses.includes(snapshot.status)) return false;
      return snapshot.period.overlaps(params.period);
    });
  }
}
