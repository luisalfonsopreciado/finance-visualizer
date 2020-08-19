import * as cts from "./constants";

describe("getRelativeStrike", () => {
  it("Validates geRelativeStrike", () => {
    expect(cts.getRelativeStrike(100, 10, 1)).toEqual(110);
    expect(cts.getRelativeStrike(100, 10, -1)).toEqual(90);
    expect(cts.getRelativeStrike(100, 10, 0.5)).toEqual(105);
    expect(cts.getRelativeStrike(100, 10, -0.5)).toEqual(95);

    expect(cts.getRelativeStrike(120, 10, 1)).toEqual(132);
  });
});
