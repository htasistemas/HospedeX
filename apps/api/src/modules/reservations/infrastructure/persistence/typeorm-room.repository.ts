import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Room } from "../../domain/room.entity";
import { RoomRepository } from "../../domain/room.repository";
import { RoomType } from "../../domain/room-type.entity";
import { RoomOrmEntity } from "./room.orm-entity";
import { RoomTypeOrmEntity } from "./room-type.orm-entity";

@Injectable()
export class TypeOrmRoomRepository implements RoomRepository {
  constructor(
    @InjectRepository(RoomOrmEntity) private readonly rooms: Repository<RoomOrmEntity>,
    @InjectRepository(RoomTypeOrmEntity) private readonly roomTypes: Repository<RoomTypeOrmEntity>
  ) {}

  async findRoom(tenantId: string, roomId: string): Promise<Room | null> {
    const entity = await this.rooms.findOne({ where: { tenantId, id: roomId } });
    return entity ? new Room(entity) : null;
  }

  async findRoomType(tenantId: string, roomTypeId: string): Promise<RoomType | null> {
    const entity = await this.roomTypes.findOne({ where: { tenantId, id: roomTypeId, active: true } });
    if (!entity) {
      return null;
    }
    return new RoomType({ ...entity, baseRate: Number(entity.baseRate) });
  }

  async countActiveRoomsByType(tenantId: string, roomTypeId: string): Promise<number> {
    return this.rooms.count({ where: { tenantId, roomTypeId, active: true } });
  }
}
