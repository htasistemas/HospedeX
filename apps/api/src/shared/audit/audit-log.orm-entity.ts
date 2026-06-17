import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("logs_auditoria")
export class AuditLogOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "tenant_id", type: "uuid" })
  tenantId!: string;

  @Column({ name: "ator_id", type: "uuid", nullable: true })
  actorId!: string | null;

  @Column({ name: "acao", type: "varchar", length: 80 })
  action!: string;

  @Column({ name: "entidade_nome", type: "varchar", length: 80 })
  entityName!: string;

  @Column({ name: "entidade_id", type: "uuid" })
  entityId!: string;

  @Column({ name: "antes", type: "jsonb", default: {} })
  before!: Record<string, unknown>;

  @Column({ name: "depois", type: "jsonb", default: {} })
  after!: Record<string, unknown>;

  @Column({ name: "correlation_id", type: "varchar", length: 120 })
  correlationId!: string;

  @CreateDateColumn({ name: "criado_em" })
  createdAt!: Date;
}
