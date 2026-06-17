import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, MoreThan, Not, Repository } from "typeorm";
import { ReservationStatus } from "@hospedex/contracts";
import { Reservation } from "../../domain/reservation.entity";
import { ReservationRepository } from "../../domain/reservation.repository";
import { StayPeriod } from "../../domain/stay-period";
import { ReservationMapper } from "./reservation.mapper";
import { ReservationOrmEntity } from "./reservation.orm-entity";

@Injectable()
export class TypeOrmReservationRepository implements ReservationRepository {
  constructor(
    @InjectRepository(ReservationOrmEntity)
    private readonly repository: Repository<ReservationOrmEntity>
  ) {}

  async nextSequence(tenantId: string): Promise<number> {
    return (await this.repository.count({ where: { tenantId } })) + 1;
  }

  async save(reservation: Reservation): Promise<Reservation> {
    const entity = await this.repository.save(ReservationMapper.toOrm(reservation));
    return ReservationMapper.toDomain(entity);
  }

  async findById(tenantId: string, id: string): Promise<Reservation | null> {
    const entity = await this.repository.findOne({ where: { tenantId, id } });
    return entity ? ReservationMapper.toDomain(entity) : null;
  }

  async findOverlapping(params: {
    tenantId: string;
    roomId?: string | null;
    roomTypeId?: string;
    period: StayPeriod;
    ignoreReservationId?: string;
    statuses?: ReservationStatus[];
  }): Promise<Reservation[]> {
    const where = {
      tenantId: params.tenantId,
      ...(params.roomId ? { roomId: params.roomId } : {}),
      ...(params.roomTypeId ? { roomTypeId: params.roomTypeId } : {}),
      ...(params.ignoreReservationId ? { id: Not(params.ignoreReservationId) } : {}),
      checkInDate: LessThan(params.period.checkOutDate.toISOString().slice(0, 10)),
      checkOutDate: MoreThan(params.period.checkInDate.toISOString().slice(0, 10))
    };

    const rows = await this.repository.find({ where });
    return rows.map(ReservationMapper.toDomain);
  }
}
