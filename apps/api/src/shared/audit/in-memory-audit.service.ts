import { Injectable, Logger } from "@nestjs/common";
import { TenantContext } from "../tenant/tenant-context";

@Injectable()
export class InMemoryAuditService {
  private readonly logger = new Logger(InMemoryAuditService.name);

  async record(params: {
    context: TenantContext;
    action: string;
    entityName: string;
    entityId: string;
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  }): Promise<void> {
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
