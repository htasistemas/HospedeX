import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReservationsModule } from "./modules/reservations/reservations.module";
import { AuditLogOrmEntity } from "./shared/audit/audit-log.orm-entity";

const useInMemoryDb = process.env.USE_IN_MEMORY_DB === "true";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...(useInMemoryDb
      ? []
      : [
          TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.POSTGRES_HOST ?? "localhost",
            port: Number(process.env.POSTGRES_PORT ?? 5432),
            username: process.env.POSTGRES_USER ?? "hospedex",
            password: process.env.POSTGRES_PASSWORD ?? "hospedex",
            database: process.env.POSTGRES_DB ?? "hospedex",
            entities: [__dirname + "/**/*.orm-entity{.ts,.js}", AuditLogOrmEntity],
            synchronize: false,
            logging: process.env.TYPEORM_LOGGING === "true"
          })
        ]),
    ReservationsModule
  ]
})
export class AppModule {}
