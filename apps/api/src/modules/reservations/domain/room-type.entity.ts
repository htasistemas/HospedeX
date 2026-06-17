export interface RoomTypeProps {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  capacityAdults: number;
  capacityChildren: number;
  baseRate: number;
  active: boolean;
}

export class RoomType {
  constructor(private readonly props: RoomTypeProps) {}

  get snapshot(): RoomTypeProps {
    return { ...this.props };
  }

  supportsGuests(adults: number, children: number): boolean {
    return adults <= this.props.capacityAdults && children <= this.props.capacityChildren;
  }
}
