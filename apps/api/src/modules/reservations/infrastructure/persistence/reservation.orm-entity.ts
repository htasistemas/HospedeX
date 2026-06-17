import { ReservationOrigin, ReservationStatus } from "@hospedex/contracts";
import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("reservas")
@Index(["tenantId", "roomId", "checkInDate", "checkOutDate"])
@Index(["tenantId", "roomTypeId", "checkInDate", "checkOutDate"])
export class ReservationOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "tenant_id", type: "uuid" })
  tenantId!: string;

  @Column({ type: "varchar", length: 30 })
  code!: string;

  @Column({ name: "hospede_id", type: "uuid" })
  guestId!: string;

  @Column({ name: "nome_hospede", type: "varchar", length: 160 })
  guestName!: string;

  @Column({ name: "tipo_quarto_id", type: "uuid" })
  roomTypeId!: string;

  @Column({ name: "quarto_id", type: "uuid", nullable: true })
  roomId!: string | null;

  @Column({ name: "reserva_grupo_id", type: "uuid", nullable: true })
  groupReservationId!: string | null;

  @Column({ type: "int" })
  adults!: number;

  @Column({ name: "criancas", type: "int" })
  children!: number;

  @Column({ name: "data_entrada", type: "date" })
  checkInDate!: string;

  @Column({ name: "data_saida", type: "date" })
  checkOutDate!: string;

  @Column({ type: "enum", enum: ReservationOrigin })
  origin!: ReservationOrigin;

  @Column({ name: "plano_tarifario_id", type: "uuid" })
  ratePlanId!: string;

  @Column({ name: "tarifa_diaria", type: "numeric", precision: 12, scale: 2 })
  dailyRate!: string;

  @Column({ name: "valor_total", type: "numeric", precision: 12, scale: 2 })
  totalAmount!: string;

  @Column({ name: "moeda", type: "char", length: 3, default: "BRL" })
  currency!: string;

  @Column({ type: "enum", enum: ReservationStatus })
  status!: ReservationStatus;

  @Column({ name: "observacoes", type: "text", nullable: true })
  notes!: string | null;

  @Column({ name: "overbooking_autorizado_por", type: "uuid", nullable: true })
  overbookingAuthorizedBy!: string | null;

  @CreateDateColumn({ name: "criado_em" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "atualizado_em" })
  updatedAt!: Date;
}
