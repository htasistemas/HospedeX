import { ReservationStatus } from "@hospedex/contracts";
import { Reservation } from "./reservation.entity";

export interface AvailabilityDecision {
  available: boolean;
  overbooked: boolean;
  shouldWaitlist: boolean;
}

export class AvailabilityPolicy {
  static decide(params: {
    activeRooms: number;
    overlappingReservations: Reservation[];
    requestedRoomId?: string | null;
    allowOverbooking: boolean;
  }): AvailabilityDecision {
    const activeStatuses: ReservationStatus[] = [
        ReservationStatus.Confirmed,
        ReservationStatus.Guaranteed,
        ReservationStatus.CheckedIn
      ];
    const activeReservations = params.overlappingReservations.filter((reservation) =>
      activeStatuses.includes(reservation.snapshot.status)
    );

    if (params.requestedRoomId) {
      const sameRoomReserved = activeReservations.some((reservation) => reservation.snapshot.roomId === params.requestedRoomId);
      return {
        available: !sameRoomReserved,
        overbooked: sameRoomReserved && params.allowOverbooking,
        shouldWaitlist: sameRoomReserved && !params.allowOverbooking
      };
    }

    const available = activeReservations.length < params.activeRooms;
    return {
      available,
      overbooked: !available && params.allowOverbooking,
      shouldWaitlist: !available && !params.allowOverbooking
    };
  }
}
