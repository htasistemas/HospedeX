import { Money } from "../../domain/money";
import { Reservation } from "../../domain/reservation.entity";
import { StayPeriod } from "../../domain/stay-period";
import { ReservationOrmEntity } from "./reservation.orm-entity";

export class ReservationMapper {
  static toDomain(entity: ReservationOrmEntity): Reservation {
    return Reservation.rehydrate({
      id: entity.id,
      tenantId: entity.tenantId,
      code: entity.code,
      guestId: entity.guestId,
      guestName: entity.guestName,
      roomTypeId: entity.roomTypeId,
      roomId: entity.roomId,
      groupReservationId: entity.groupReservationId,
      adults: entity.adults,
      children: entity.children,
      period: StayPeriod.create(new Date(entity.checkInDate), new Date(entity.checkOutDate)),
      origin: entity.origin,
      ratePlanId: entity.ratePlanId,
      dailyRate: Money.create(Number(entity.dailyRate), entity.currency),
      totalAmount: Money.create(Number(entity.totalAmount), entity.currency),
      status: entity.status,
      notes: entity.notes,
      overbookingAuthorizedBy: entity.overbookingAuthorizedBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }

  static toOrm(reservation: Reservation): ReservationOrmEntity {
    const snapshot = reservation.snapshot;
    const entity = new ReservationOrmEntity();
    entity.id = snapshot.id;
    entity.tenantId = snapshot.tenantId;
    entity.code = snapshot.code;
    entity.guestId = snapshot.guestId;
    entity.guestName = snapshot.guestName;
    entity.roomTypeId = snapshot.roomTypeId;
    entity.roomId = snapshot.roomId ?? null;
    entity.groupReservationId = snapshot.groupReservationId ?? null;
    entity.adults = snapshot.adults;
    entity.children = snapshot.children;
    entity.checkInDate = snapshot.period.checkInDate.toISOString().slice(0, 10);
    entity.checkOutDate = snapshot.period.checkOutDate.toISOString().slice(0, 10);
    entity.origin = snapshot.origin;
    entity.ratePlanId = snapshot.ratePlanId;
    entity.dailyRate = snapshot.dailyRate.amount.toFixed(2);
    entity.totalAmount = snapshot.totalAmount.amount.toFixed(2);
    entity.currency = snapshot.totalAmount.currency;
    entity.status = snapshot.status;
    entity.notes = snapshot.notes ?? null;
    entity.overbookingAuthorizedBy = snapshot.overbookingAuthorizedBy ?? null;
    return entity;
  }
}
