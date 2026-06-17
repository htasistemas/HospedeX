import { RoomOperationalStatus } from "@hospedex/contracts";
import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("quartos")
@Index(["tenantId", "roomTypeId"])
export class RoomOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "tenant_id", type: "uuid" })
  tenantId!: string;

  @Column({ name: "tipo_quarto_id", type: "uuid" })
  roomTypeId!: string;

  @Column({ name: "numero", type: "varchar", length: 20 })
  number!: string;

  @Column({ name: "andar", type: "varchar", length: 20, nullable: true })
  floor!: string | null;

  @Column({ type: "enum", enum: RoomOperationalStatus })
  status!: RoomOperationalStatus;

  @Column({ name: "ativo", type: "boolean", default: true })
  active!: boolean;
}
