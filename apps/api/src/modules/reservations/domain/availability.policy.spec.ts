import { ReservationOrigin } from "@hospedex/contracts";
import { randomUUID } from "node:crypto";
import { AvailabilityPolicy } from "./availability.policy";
import { Money } from "./money";
import { Reservation } from "./reservation.entity";
import { StayPeriod } from "./stay-period";

function reservation(roomId: string) {
  return Reservation.create({
    id: randomUUID(),
    tenantId: randomUUID(),
    code: "RSV-2026-000001",
    guestId: randomUUID(),
    guestName: "Teste",
    roomTypeId: randomUUID(),
    roomId,
    adults: 1,
    children: 0,
    period: StayPeriod.create(new Date("2026-07-01"), new Date("2026-07-02")),
    origin: ReservationOrigin.Direct,
    ratePlanId: randomUUID(),
    dailyRate: Money.brl(100)
  });
}

describe("AvailabilityPolicy", () => {
  it("libera quando ha quartos ativos suficientes", () => {
    const decision = AvailabilityPolicy.decide({
      activeRooms: 2,
      overlappingReservations: [reservation("101")],
      allowOverbooking: false
    });

    expect(decision.available).toBe(true);
    expect(decision.shouldWaitlist).toBe(false);
  });

  it("envia para lista de espera sem disponibilidade", () => {
    const decision = AvailabilityPolicy.decide({
      activeRooms: 1,
      overlappingReservations: [reservation("101")],
      allowOverbooking: false
    });

    expect(decision.available).toBe(false);
    expect(decision.shouldWaitlist).toBe(true);
  });

  it("marca overbooking quando autorizado", () => {
    const decision = AvailabilityPolicy.decide({
      activeRooms: 1,
      overlappingReservations: [reservation("101")],
      allowOverbooking: true
    });

    expect(decision.overbooked).toBe(true);
    expect(decision.shouldWaitlist).toBe(false);
  });
});
