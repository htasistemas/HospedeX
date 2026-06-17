import { Room } from "./room.entity";
import { RoomType } from "./room-type.entity";

export const ROOM_REPOSITORY = Symbol("ROOM_REPOSITORY");

export interface RoomRepository {
  findRoom(tenantId: string, roomId: string): Promise<Room | null>;
  findRoomType(tenantId: string, roomTypeId: string): Promise<RoomType | null>;
  countActiveRoomsByType(tenantId: string, roomTypeId: string): Promise<number>;
}
