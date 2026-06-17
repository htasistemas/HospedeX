import { randomUUID } from "node:crypto";
import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface TenantContext {
  tenantId: string;
  userId: string;
  roles: string[];
  permissions: string[];
  correlationId: string;
}

export const Tenant = createParamDecorator((_data: unknown, context: ExecutionContext): TenantContext => {
  const request = context.switchToHttp().getRequest();
  const tenantId = request.headers["x-tenant-id"];
  const userId = request.headers["x-user-id"];
  const correlationId = request.headers["x-correlation-id"];
  if (!tenantId || Array.isArray(tenantId)) {
    throw new BadRequestException("Header x-tenant-id e obrigatorio.");
  }

  return {
    tenantId,
    userId: request.user?.id ?? (typeof userId === "string" ? userId : "system"),
    roles: request.user?.roles ?? [],
    permissions: request.user?.permissions ?? [],
    correlationId: typeof correlationId === "string" ? correlationId : randomUUID()
  };
});
