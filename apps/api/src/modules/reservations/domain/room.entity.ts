import { RoomOperationalStatus } from "@hospedex/contracts";

export interface RoomProps {
  id: string;
  tenantId: string;
  roomTypeId: string;
  number: string;
  floor?: string | null;
  status: RoomOperationalStatus;
  active: boolean;
}

export class Room {
  constructor(private readonly props: RoomProps) {}

  get snapshot(): RoomProps {
    return { ...this.props };
  }

  canReceiveReservation(): boolean {
    const unavailableStatuses: RoomOperationalStatus[] = [
      RoomOperationalStatus.Maintenance,
      RoomOperationalStatus.Blocked,
      RoomOperationalStatus.OutOfOrder
    ];
    return this.props.active && !unavailableStatuses.includes(this.props.status);
  }
}
