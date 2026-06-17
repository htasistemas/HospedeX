import { Injectable } from "@nestjs/common";
import { RoomOperationalStatus } from "@hospedex/contracts";
import { Room } from "../../domain/room.entity";
import { RoomRepository } from "../../domain/room.repository";
import { RoomType } from "../../domain/room-type.entity";

const tenantId = "00000000-0000-0000-0000-000000000001";
const standardRoomTypeId = "11111111-1111-4111-8111-111111111101";
const luxuryRoomTypeId = "11111111-1111-4111-8111-111111111102";

@Injectable()
export class InMemoryRoomRepository implements RoomRepository {
  private readonly roomTypes = [
    new RoomType({
      id: standardRoomTypeId,
      tenantId,
      name: "Standard",
      code: "STD",
      capacityAdults: 2,
      capacityChildren: 1,
      baseRate: 280,
      active: true
    }),
    new RoomType({
      id: luxuryRoomTypeId,
      tenantId,
      name: "Luxo",
      code: "LUX",
      capacityAdults: 2,
      capacityChildren: 2,
      baseRate: 420,
      active: true
    })
  ];

  private readonly rooms = [
    new Room({
      id: "22222222-2222-4222-8222-222222222101",
      tenantId,
      roomTypeId: standardRoomTypeId,
      number: "101",
      floor: "1",
      status: RoomOperationalStatus.Free,
      active: true
    }),
    new Room({
      id: "22222222-2222-4222-8222-222222222102",
      tenantId,
      roomTypeId: standardRoomTypeId,
      number: "102",
      floor: "1",
      status: RoomOperationalStatus.Free,
      active: true
    })
  ];

  async findRoom(currentTenantId: string, roomId: string): Promise<Room | null> {
    return this.rooms.find((room) => room.snapshot.tenantId === currentTenantId && room.snapshot.id === roomId) ?? null;
  }

  async findRoomType(currentTenantId: string, roomTypeId: string): Promise<RoomType | null> {
    return this.roomTypes.find((roomType) => roomType.snapshot.tenantId === currentTenantId && roomType.snapshot.id === roomTypeId) ?? null;
  }

  async countActiveRoomsByType(currentTenantId: string, roomTypeId: string): Promise<number> {
    return this.rooms.filter((room) => {
      const snapshot = room.snapshot;
      return snapshot.tenantId === currentTenantId && snapshot.roomTypeId === roomTypeId && snapshot.active;
    }).length;
  }
}
