import { Inject, Injectable, Logger, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { TenantContext } from "../../../shared/tenant/tenant-context";
import { AuditService } from "../../../shared/audit/audit.service";
import { AvailabilityPolicy } from "../domain/availability.policy";
import { Money } from "../domain/money";
import { Reservation } from "../domain/reservation.entity";
import { ReservationCode } from "../domain/reservation-code";
import { RESERVATION_REPOSITORY, ReservationRepository } from "../domain/reservation.repository";
import { ROOM_REPOSITORY, RoomRepository } from "../domain/room.repository";
import { StayPeriod } from "../domain/stay-period";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { ReservationPresenter } from "./reservation.presenter";

@Injectable()
export class CreateReservationUseCase {
  private readonly logger = new Logger(CreateReservationUseCase.name);

  constructor(
    @Inject(RESERVATION_REPOSITORY) private readonly reservations: ReservationRepository,
    @Inject(ROOM_REPOSITORY) private readonly rooms: RoomRepository,
    private readonly audit: AuditService
  ) {}

  async execute(context: TenantContext, dto: CreateReservationDto) {
    const period = StayPeriod.create(new Date(dto.checkInDate), new Date(dto.checkOutDate));
    const roomType = await this.rooms.findRoomType(context.tenantId, dto.roomTypeId);
    if (!roomType) {
      throw new NotFoundException("Tipo de quarto nao encontrado.");
    }
    if (!roomType.supportsGuests(dto.adults, dto.children)) {
      throw new UnprocessableEntityException("Quantidade de hospedes excede a capacidade da categoria.");
    }

    if (dto.roomId) {
      const room = await this.rooms.findRoom(context.tenantId, dto.roomId);
      if (!room?.canReceiveReservation()) {
        throw new UnprocessableEntityException("Quarto indisponivel para reserva.");
      }
    }

    const overlapping = await this.reservations.findOverlapping({
      tenantId: context.tenantId,
      roomId: dto.roomId,
      roomTypeId: dto.roomTypeId,
      period
    });
    const activeRooms = await this.rooms.countActiveRoomsByType(context.tenantId, dto.roomTypeId);
    const decision = AvailabilityPolicy.decide({
      activeRooms,
      overlappingReservations: overlapping,
      requestedRoomId: dto.roomId,
      allowOverbooking: dto.allowOverbooking === true
    });

    const sequence = await this.reservations.nextSequence(context.tenantId);
    const reservation = Reservation.create({
      id: randomUUID(),
      tenantId: context.tenantId,
      code: ReservationCode.generate(sequence),
      guestId: dto.guestId,
      guestName: dto.guestName,
      roomTypeId: dto.roomTypeId,
      roomId: decision.available ? dto.roomId ?? null : null,
      adults: dto.adults,
      children: dto.children,
      period,
      origin: dto.origin,
      ratePlanId: dto.ratePlanId,
      dailyRate: Money.brl(dto.dailyRate),
      notes: dto.notes ?? null,
      overbookingAuthorizedBy: null
    });

    if (decision.overbooked) {
      reservation.authorizeOverbooking(context.userId);
    }
    if (decision.shouldWaitlist) {
      reservation.waitlist();
    }

    const saved = await this.reservations.save(reservation);
    await this.audit.record({
      context,
      action: "reservation.created",
      entityName: "Reservation",
      entityId: saved.snapshot.id,
      after: saved.snapshot as unknown as Record<string, unknown>
    });

    this.logger.log({ tenantId: context.tenantId, reservationId: saved.snapshot.id, correlationId: context.correlationId });
    return ReservationPresenter.summary(saved);
  }
}
