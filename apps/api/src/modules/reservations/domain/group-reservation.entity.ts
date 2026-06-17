import { ReservationDomainError } from "./reservation.errors";
import { StayPeriod } from "./stay-period";

export interface RoomingListItem {
  guestName: string;
  roomTypeId: string;
  roomId?: string | null;
  adults: number;
  children: number;
  notes?: string;
}

export interface GroupReservationProps {
  id: string;
  tenantId: string;
  name: string;
  companyId?: string | null;
  eventName?: string | null;
  period: StayPeriod;
  blockedRoomIds: string[];
  roomingList: RoomingListItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class GroupReservation {
  private constructor(private readonly props: GroupReservationProps) {}

  static create(props: GroupReservationProps): GroupReservation {
    if (!props.name.trim()) {
      throw new ReservationDomainError("Reserva de grupo precisa de nome.");
    }
    if (!props.blockedRoomIds.length) {
      throw new ReservationDomainError("Reserva de grupo precisa bloquear ao menos um quarto.");
    }
    return new GroupReservation(props);
  }

  get snapshot(): GroupReservationProps {
    return { ...this.props, blockedRoomIds: [...this.props.blockedRoomIds], roomingList: [...this.props.roomingList] };
  }
}
