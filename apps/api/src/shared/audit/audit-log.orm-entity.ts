import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("audit_logs")
export class AuditLogOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "tenant_id", type: "uuid" })
  tenantId!: string;

  @Column({ name: "actor_id", type: "uuid", nullable: true })
  actorId!: string | null;

  @Column({ type: "varchar", length: 80 })
  action!: string;

  @Column({ name: "entity_name", type: "varchar", length: 80 })
  entityName!: string;

  @Column({ name: "entity_id", type: "uuid" })
  entityId!: string;

  @Column({ type: "jsonb", default: {} })
  before!: Record<string, unknown>;

  @Column({ type: "jsonb", default: {} })
  after!: Record<string, unknown>;

  @Column({ name: "correlation_id", type: "varchar", length: 120 })
  correlationId!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
