import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { TenantContext } from "../../../shared/tenant/tenant-context";
import { AuditService } from "../../../shared/audit/audit.service";
import { RESERVATION_REPOSITORY, ReservationRepository } from "../domain/reservation.repository";
import { ReservationPresenter } from "./reservation.presenter";

@Injectable()
export class CancelReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY) private readonly reservations: ReservationRepository,
    private readonly audit: AuditService
  ) {}

  async execute(context: TenantContext, reservationId: string) {
    const reservation = await this.reservations.findById(context.tenantId, reservationId);
    if (!reservation) {
      throw new NotFoundException("Reserva nao encontrada.");
    }

    const before = reservation.snapshot;
    reservation.cancel();
    const saved = await this.reservations.save(reservation);
    await this.audit.record({
      context,
      action: "reservation.cancelled",
      entityName: "Reservation",
      entityId: saved.snapshot.id,
      before: before as unknown as Record<string, unknown>,
      after: saved.snapshot as unknown as Record<string, unknown>
    });

    return ReservationPresenter.summary(saved);
  }
}
