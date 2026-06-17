import { ReservationOrigin, ReservationStatus } from "@hospedex/contracts";
import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("reservations")
@Index(["tenantId", "roomId", "checkInDate", "checkOutDate"])
@Index(["tenantId", "roomTypeId", "checkInDate", "checkOutDate"])
export class ReservationOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "tenant_id", type: "uuid" })
  tenantId!: string;

  @Column({ type: "varchar", length: 30 })
  code!: string;

  @Column({ name: "guest_id", type: "uuid" })
  guestId!: string;

  @Column({ name: "guest_name", type: "varchar", length: 160 })
  guestName!: string;

  @Column({ name: "room_type_id", type: "uuid" })
  roomTypeId!: string;

  @Column({ name: "room_id", type: "uuid", nullable: true })
  roomId!: string | null;

  @Column({ name: "group_reservation_id", type: "uuid", nullable: true })
  groupReservationId!: string | null;

  @Column({ type: "int" })
  adults!: number;

  @Column({ type: "int" })
  children!: number;

  @Column({ name: "check_in_date", type: "date" })
  checkInDate!: string;

  @Column({ name: "check_out_date", type: "date" })
  checkOutDate!: string;

  @Column({ type: "enum", enum: ReservationOrigin })
  origin!: ReservationOrigin;

  @Column({ name: "rate_plan_id", type: "uuid" })
  ratePlanId!: string;

  @Column({ name: "daily_rate", type: "numeric", precision: 12, scale: 2 })
  dailyRate!: string;

  @Column({ name: "total_amount", type: "numeric", precision: 12, scale: 2 })
  totalAmount!: string;

  @Column({ name: "currency", type: "char", length: 3, default: "BRL" })
  currency!: string;

  @Column({ type: "enum", enum: ReservationStatus })
  status!: ReservationStatus;

  @Column({ type: "text", nullable: true })
  notes!: string | null;

  @Column({ name: "overbooking_authorized_by", type: "uuid", nullable: true })
  overbookingAuthorizedBy!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
