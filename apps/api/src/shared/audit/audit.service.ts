import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TenantContext } from "../tenant/tenant-context";
import { AuditLogOrmEntity } from "./audit-log.orm-entity";

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLogOrmEntity)
    private readonly auditRepository: Repository<AuditLogOrmEntity>
  ) {}

  async record(params: {
    context: TenantContext;
    action: string;
    entityName: string;
    entityId: string;
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  }): Promise<void> {
    await this.auditRepository.save({
      tenantId: params.context.tenantId,
      actorId: params.context.userId === "system" ? null : params.context.userId,
      action: params.action,
      entityName: params.entityName,
      entityId: params.entityId,
      before: params.before ?? {},
      after: params.after ?? {},
      correlationId: params.context.correlationId
    });

    this.logger.log({
      tenantId: params.context.tenantId,
      actorId: params.context.userId,
      action: params.action,
      entityName: params.entityName,
      entityId: params.entityId,
      correlationId: params.context.correlationId
    });
  }
}
