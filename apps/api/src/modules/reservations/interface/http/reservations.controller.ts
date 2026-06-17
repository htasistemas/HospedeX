import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RESERVATION_PERMISSIONS } from "@hospedex/contracts";
import { Permissions } from "../../../../shared/permissions/permissions.decorator";
import { PermissionsGuard } from "../../../../shared/permissions/permissions.guard";
import { Tenant, TenantContext } from "../../../../shared/tenant/tenant-context";
import { CancelReservationUseCase } from "../../application/cancel-reservation.use-case";
import { CreateReservationUseCase } from "../../application/create-reservation.use-case";
import { AvailabilityQueryDto } from "../../application/dto/availability-query.dto";
import { CreateGroupReservationDto } from "../../application/dto/create-group-reservation.dto";
import { CreateReservationDto } from "../../application/dto/create-reservation.dto";
import { MoveReservationDto } from "../../application/dto/move-reservation.dto";
import { MoveReservationUseCase } from "../../application/move-reservation.use-case";

@ApiTags("Reservas")
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller("reservations")
export class ReservationsController {
  constructor(
    private readonly createReservation: CreateReservationUseCase,
    private readonly moveReservation: MoveReservationUseCase,
    private readonly cancelReservation: CancelReservationUseCase
  ) {}

  @Get("availability")
  @Permissions(RESERVATION_PERMISSIONS.VIEW)
  @ApiOperation({ summary: "Mapa de disponibilidade por dia, semana, quinzena ou mes." })
  availability(@Tenant() context: TenantContext, @Query() query: AvailabilityQueryDto) {
    return {
      tenantId: context.tenantId,
      query,
      slots: [],
      message: "Consulta operacional pronta para conectar ao read model de disponibilidade."
    };
  }

  @Post()
  @Permissions(RESERVATION_PERMISSIONS.CREATE)
  @ApiOperation({ summary: "Cria reserva individual com controle de disponibilidade, overbooking e lista de espera." })
  create(@Tenant() context: TenantContext, @Body() dto: CreateReservationDto) {
    return this.createReservation.execute(context, dto);
  }

  @Post("groups")
  @Permissions(RESERVATION_PERMISSIONS.GROUP_CREATE)
  @ApiOperation({ summary: "Cria reserva de grupo com bloqueio de quartos e rooming list." })
  createGroup(@Tenant() context: TenantContext, @Body() dto: CreateGroupReservationDto) {
    return {
      tenantId: context.tenantId,
      ...dto,
      status: "technical-contract-ready"
    };
  }

  @Patch(":id/move")
  @Permissions(RESERVATION_PERMISSIONS.MOVE)
  @ApiOperation({ summary: "Move reserva entre quartos ou altera datas via drag-and-drop." })
  move(@Tenant() context: TenantContext, @Param("id") id: string, @Body() dto: MoveReservationDto) {
    return this.moveReservation.execute(context, id, dto);
  }

  @Delete(":id")
  @Permissions(RESERVATION_PERMISSIONS.CANCEL)
  @ApiOperation({ summary: "Cancela reserva e registra auditoria completa." })
  cancel(@Tenant() context: TenantContext, @Param("id") id: string) {
    return this.cancelReservation.execute(context, id);
  }
}
