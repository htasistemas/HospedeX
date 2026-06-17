import { ReservationStatus } from "@hospedex/contracts";
import { Reservation } from "./reservation.entity";
import { StayPeriod } from "./stay-period";

export const RESERVATION_REPOSITORY = Symbol("RESERVATION_REPOSITORY");

export interface ReservationRepository {
  nextSequence(tenantId: string): Promise<number>;
  save(reservation: Reservation): Promise<Reservation>;
  findById(tenantId: string, id: string): Promise<Reservation | null>;
  findOverlapping(params: {
    tenantId: string;
    roomId?: string | null;
    roomTypeId?: string;
    period: StayPeriod;
    ignoreReservationId?: string;
    statuses?: ReservationStatus[];
  }): Promise<Reservation[]>;
}
