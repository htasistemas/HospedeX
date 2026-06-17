import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { TenantContext } from "../../../shared/tenant/tenant-context";
import { AuditService } from "../../../shared/audit/audit.service";
import { AvailabilityPolicy } from "../domain/availability.policy";
import { RESERVATION_REPOSITORY, ReservationRepository } from "../domain/reservation.repository";
import { ROOM_REPOSITORY, RoomRepository } from "../domain/room.repository";
import { StayPeriod } from "../domain/stay-period";
import { MoveReservationDto } from "./dto/move-reservation.dto";
import { ReservationPresenter } from "./reservation.presenter";

@Injectable()
export class MoveReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY) private readonly reservations: ReservationRepository,
    @Inject(ROOM_REPOSITORY) private readonly rooms: RoomRepository,
    private readonly audit: AuditService
  ) {}

  async execute(context: TenantContext, reservationId: string, dto: MoveReservationDto) {
    const reservation = await this.reservations.findById(context.tenantId, reservationId);
    if (!reservation) {
      throw new NotFoundException("Reserva nao encontrada.");
    }

    const before = reservation.snapshot;
    const period = StayPeriod.create(new Date(dto.checkInDate), new Date(dto.checkOutDate));
    const overlapping = await this.reservations.findOverlapping({
      tenantId: context.tenantId,
      roomId: dto.roomId,
      roomTypeId: before.roomTypeId,
      period,
      ignoreReservationId: reservationId
    });
    const activeRooms = await this.rooms.countActiveRoomsByType(context.tenantId, before.roomTypeId);
    const decision = AvailabilityPolicy.decide({
      activeRooms,
      overlappingReservations: overlapping,
      requestedRoomId: dto.roomId,
      allowOverbooking: false
    });

    if (!decision.available) {
      throw new UnprocessableEntityException("Movimentacao bloqueada: periodo ou quarto sem disponibilidade.");
    }

    reservation.moveTo(dto.roomId ?? null, period);
    const saved = await this.reservations.save(reservation);
    await this.audit.record({
      context,
      action: "reservation.moved",
      entityName: "Reservation",
      entityId: saved.snapshot.id,
      before: before as unknown as Record<string, unknown>,
      after: saved.snapshot as unknown as Record<string, unknown>
    });

    return ReservationPresenter.summary(saved);
  }
}
