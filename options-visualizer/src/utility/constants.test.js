import * as cts from "./constants";

describe("getRelativeStrike", () => {
  it("Validates geRelativeStrike", () => {
    expect(cts.getRelativeStrike(100, 10, 1)).toEqual(110);
    expect(cts.getRelativeStrike(100, 10, -1)).toEqual(90);
    expect(cts.getRelativeStrike(100, 10, 0.5)).toEqual(105);
    expect(cts.getRelativeStrike(100, 10, -0.5)).toEqual(95);

    expect(cts.getRelativeStrike(120, 10, 1)).toEqual(132);
  });
  it("Round a decimal properly", () => {
    expect(cts.round(100)).toEqual(100.00)
    expect(cts.round("100")).toEqual(100.00)
    expect(cts.round("100.123")).toEqual(100.12)
    expect(cts.round(2.333)).toEqual(2.33)
    expect(cts.round("01.11")).toEqual(1.11)
  })
});
