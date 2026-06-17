import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { RoomingListItem } from "../../domain/group-reservation.entity";

@Entity("reservas_grupo")
export class GroupReservationOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "tenant_id", type: "uuid" })
  tenantId!: string;

  @Column({ type: "varchar", length: 160 })
  name!: string;

  @Column({ name: "empresa_id", type: "uuid", nullable: true })
  companyId!: string | null;

  @Column({ name: "nome_evento", type: "varchar", length: 160, nullable: true })
  eventName!: string | null;

  @Column({ name: "data_entrada", type: "date" })
  checkInDate!: string;

  @Column({ name: "data_saida", type: "date" })
  checkOutDate!: string;

  @Column({ name: "quartos_bloqueados_ids", type: "uuid", array: true })
  blockedRoomIds!: string[];

  @Column({ name: "lista_hospedes", type: "jsonb", default: [] })
  roomingList!: RoomingListItem[];

  @CreateDateColumn({ name: "criado_em" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "atualizado_em" })
  updatedAt!: Date;
}
