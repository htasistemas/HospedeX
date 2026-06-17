import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { RoomingListItem } from "../../domain/group-reservation.entity";

@Entity("group_reservations")
export class GroupReservationOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "tenant_id", type: "uuid" })
  tenantId!: string;

  @Column({ type: "varchar", length: 160 })
  name!: string;

  @Column({ name: "company_id", type: "uuid", nullable: true })
  companyId!: string | null;

  @Column({ name: "event_name", type: "varchar", length: 160, nullable: true })
  eventName!: string | null;

  @Column({ name: "check_in_date", type: "date" })
  checkInDate!: string;

  @Column({ name: "check_out_date", type: "date" })
  checkOutDate!: string;

  @Column({ name: "blocked_room_ids", type: "uuid", array: true })
  blockedRoomIds!: string[];

  @Column({ name: "rooming_list", type: "jsonb", default: [] })
  roomingList!: RoomingListItem[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
