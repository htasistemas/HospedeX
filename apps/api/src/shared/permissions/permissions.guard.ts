import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "./permissions.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!required?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const rawPermissions = request.headers["x-permissions"];
    const headerPermissions = typeof rawPermissions === "string" ? rawPermissions.split(",") : [];
    const permissions = request.user?.permissions ?? headerPermissions;
    const allowed = required.every((permission) => permissions.includes(permission));
    if (!allowed) {
      throw new ForbiddenException("Perfil sem permissao para esta acao.");
    }

    return true;
  }
}
