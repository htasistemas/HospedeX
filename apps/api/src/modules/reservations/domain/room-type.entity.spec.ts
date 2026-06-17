import { RoomType } from "./room-type.entity";

describe("RoomType", () => {
  it("valida capacidade por adultos e criancas", () => {
    const roomType = new RoomType({
      id: "type-1",
      tenantId: "tenant-1",
      name: "Luxo",
      code: "LUX",
      capacityAdults: 2,
      capacityChildren: 1,
      baseRate: 300,
      active: true
    });

    expect(roomType.supportsGuests(2, 1)).toBe(true);
    expect(roomType.supportsGuests(3, 0)).toBe(false);
  });
});
