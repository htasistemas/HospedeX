import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("room_types")
@Index(["tenantId", "code"], { unique: true })
export class RoomTypeOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "tenant_id", type: "uuid" })
  tenantId!: string;

  @Column({ type: "varchar", length: 120 })
  name!: string;

  @Column({ type: "varchar", length: 30 })
  code!: string;

  @Column({ name: "capacity_adults", type: "int" })
  capacityAdults!: number;

  @Column({ name: "capacity_children", type: "int" })
  capacityChildren!: number;

  @Column({ name: "base_rate", type: "numeric", precision: 12, scale: 2 })
  baseRate!: string;

  @Column({ type: "boolean", default: true })
  active!: boolean;
}
