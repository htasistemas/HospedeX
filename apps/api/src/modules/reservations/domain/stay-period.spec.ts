import { StayPeriod } from "./stay-period";

describe("StayPeriod", () => {
  it("calcula a quantidade de noites", () => {
    const period = StayPeriod.create(new Date("2026-07-01"), new Date("2026-07-04"));

    expect(period.nights).toBe(3);
  });

  it("bloqueia saida anterior ou igual a entrada", () => {
    expect(() => StayPeriod.create(new Date("2026-07-04"), new Date("2026-07-04"))).toThrow(
      "Data de saida deve ser posterior a entrada."
    );
  });

  it("identifica periodos sobrepostos", () => {
    const first = StayPeriod.create(new Date("2026-07-01"), new Date("2026-07-04"));
    const second = StayPeriod.create(new Date("2026-07-03"), new Date("2026-07-05"));

    expect(first.overlaps(second)).toBe(true);
  });
});
