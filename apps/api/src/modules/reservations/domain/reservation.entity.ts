import { ReservationOrigin, ReservationStatus } from "@hospedex/contracts";
import { Money } from "./money";
import { ReservationDomainError } from "./reservation.errors";
import { StayPeriod } from "./stay-period";

export interface ReservationProps {
  id: string;
  tenantId: string;
  code: string;
  guestId: string;
  guestName: string;
  roomTypeId: string;
  roomId?: string | null;
  groupReservationId?: string | null;
  adults: number;
  children: number;
  period: StayPeriod;
  origin: ReservationOrigin;
  ratePlanId: string;
  dailyRate: Money;
  totalAmount: Money;
  status: ReservationStatus;
  notes?: string | null;
  overbookingAuthorizedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Reservation {
  private constructor(private readonly props: ReservationProps) {}

  static create(props: Omit<ReservationProps, "status" | "totalAmount">): Reservation {
    if (props.adults < 1) {
      throw new ReservationDomainError("Reserva deve possuir pelo menos um hospede adulto.");
    }
    if (props.children < 0) {
      throw new ReservationDomainError("Quantidade de criancas nao pode ser negativa.");
    }

    return new Reservation({
      ...props,
      status: ReservationStatus.Confirmed,
      totalAmount: Money.create(props.dailyRate.amount * props.period.nights, props.dailyRate.currency)
    });
  }

  static rehydrate(props: ReservationProps): Reservation {
    return new Reservation(props);
  }

  get snapshot(): ReservationProps {
    return { ...this.props };
  }

  assignRoom(roomId: string): void {
    const closedStatuses: ReservationStatus[] = [
      ReservationStatus.Cancelled,
      ReservationStatus.CheckedOut,
      ReservationStatus.NoShow
    ];
    if (closedStatuses.includes(this.props.status)) {
      throw new ReservationDomainError("Reserva encerrada nao pode receber quarto.");
    }
    this.props.roomId = roomId;
  }

  moveTo(roomId: string | null, period: StayPeriod): void {
    const movableStatuses: ReservationStatus[] = [
      ReservationStatus.Confirmed,
      ReservationStatus.Guaranteed,
      ReservationStatus.Waitlisted
    ];
    if (!movableStatuses.includes(this.props.status)) {
      throw new ReservationDomainError("Apenas reservas futuras podem ser movidas.");
    }
    this.props.roomId = roomId;
    this.props.period = period;
    this.recalculateTotal();
  }

  guarantee(): void {
    if (this.props.status !== ReservationStatus.Confirmed) {
      throw new ReservationDomainError("Apenas reservas confirmadas podem ser garantidas.");
    }
    this.props.status = ReservationStatus.Guaranteed;
  }

  waitlist(): void {
    if (this.props.status === ReservationStatus.CheckedIn) {
      throw new ReservationDomainError("Reserva em hospedagem nao pode ir para lista de espera.");
    }
    this.props.status = ReservationStatus.Waitlisted;
    this.props.roomId = null;
  }

  authorizeOverbooking(userId: string): void {
    this.props.overbookingAuthorizedBy = userId;
  }

  cancel(): void {
    const blockedStatuses: ReservationStatus[] = [ReservationStatus.CheckedIn, ReservationStatus.CheckedOut];
    if (blockedStatuses.includes(this.props.status)) {
      throw new ReservationDomainError("Reserva em hospedagem ou finalizada nao pode ser cancelada por este fluxo.");
    }
    this.props.status = ReservationStatus.Cancelled;
  }

  private recalculateTotal(): void {
    this.props.totalAmount = Money.create(this.props.dailyRate.amount * this.props.period.nights, this.props.dailyRate.currency);
  }
}
