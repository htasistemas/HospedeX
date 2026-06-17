import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuditLogOrmEntity } from "../../shared/audit/audit-log.orm-entity";
import { AuditService } from "../../shared/audit/audit.service";
import { InMemoryAuditService } from "../../shared/audit/in-memory-audit.service";
import { CancelReservationUseCase } from "./application/cancel-reservation.use-case";
import { CreateReservationUseCase } from "./application/create-reservation.use-case";
import { MoveReservationUseCase } from "./application/move-reservation.use-case";
import { RESERVATION_REPOSITORY } from "./domain/reservation.repository";
import { ROOM_REPOSITORY } from "./domain/room.repository";
import { GroupReservationOrmEntity } from "./infrastructure/persistence/group-reservation.orm-entity";
import { ReservationOrmEntity } from "./infrastructure/persistence/reservation.orm-entity";
import { RoomOrmEntity } from "./infrastructure/persistence/room.orm-entity";
import { RoomTypeOrmEntity } from "./infrastructure/persistence/room-type.orm-entity";
import { TypeOrmReservationRepository } from "./infrastructure/persistence/typeorm-reservation.repository";
import { TypeOrmRoomRepository } from "./infrastructure/persistence/typeorm-room.repository";
import { InMemoryReservationRepository } from "./infrastructure/persistence/in-memory-reservation.repository";
import { InMemoryRoomRepository } from "./infrastructure/persistence/in-memory-room.repository";
import { ReservationsController } from "./interface/http/reservations.controller";

const useInMemoryDb = process.env.USE_IN_MEMORY_DB === "true";

@Module({
  imports: useInMemoryDb
    ? []
    : [
        TypeOrmModule.forFeature([
          AuditLogOrmEntity,
          ReservationOrmEntity,
          GroupReservationOrmEntity,
          RoomOrmEntity,
          RoomTypeOrmEntity
        ])
      ],
  controllers: [ReservationsController],
  providers: [
    { provide: AuditService, useClass: useInMemoryDb ? InMemoryAuditService : AuditService },
    CreateReservationUseCase,
    MoveReservationUseCase,
    CancelReservationUseCase,
    { provide: RESERVATION_REPOSITORY, useClass: useInMemoryDb ? InMemoryReservationRepository : TypeOrmReservationRepository },
    { provide: ROOM_REPOSITORY, useClass: useInMemoryDb ? InMemoryRoomRepository : TypeOrmRoomRepository }
  ]
})
export class ReservationsModule {}
