import { RoomOperationalStatus } from "@hospedex/contracts";
import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("rooms")
@Index(["tenantId", "roomTypeId"])
export class RoomOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "tenant_id", type: "uuid" })
  tenantId!: string;

  @Column({ name: "room_type_id", type: "uuid" })
  roomTypeId!: string;

  @Column({ type: "varchar", length: 20 })
  number!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  floor!: string | null;

  @Column({ type: "enum", enum: RoomOperationalStatus })
  status!: RoomOperationalStatus;

  @Column({ type: "boolean", default: true })
  active!: boolean;
}
