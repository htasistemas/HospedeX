import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("tipos_quarto")
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

  @Column({ name: "capacidade_adultos", type: "int" })
  capacityAdults!: number;

  @Column({ name: "capacidade_criancas", type: "int" })
  capacityChildren!: number;

  @Column({ name: "tarifa_base", type: "numeric", precision: 12, scale: 2 })
  baseRate!: string;

  @Column({ name: "ativo", type: "boolean", default: true })
  active!: boolean;
}
