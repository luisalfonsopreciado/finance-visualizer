import * as cts from "./constants"
import * as greeks from "./greeks"

describe("Greeks", function()
{
  describe("Delta", function()
  {
    it("should return ~50", function()
    {
        expect(greeks.getDelta(100, 100, .086, .1, .0015, cts.CALL)).toEqual(0.5076040742445566);
      expect(greeks.getDelta(100, 100, .086, .1, .0015, cts.PUT)).toEqual(-0.49239592575544344);
    });
    it("should return 0", function()
    {
      expect(greeks.getDelta(100, 100, 0, .1, .0015, cts.CALL)).toEqual(0);
      expect(greeks.getDelta(99.99, 100, 0, .1, .0015, cts.CALL)).toEqual(0);
      expect(greeks.getDelta(100, 100, 0, .1, .0015, cts.PUT)).toEqual(0);
      expect(greeks.getDelta(100.01, 100, 0, .1, .0015, cts.PUT)).toEqual(0);
      expect(greeks.getDelta(100, 100, .1, 0, .0015, cts.CALL)).toEqual(0);
      expect(greeks.getDelta(99.99, 100, .1, 0, .0015, cts.CALL)).toEqual(0);
      expect(greeks.getDelta(100, 100, .1, 0, .0015, cts.PUT)).toEqual(0);
      expect(greeks.getDelta(100.01, 100, .1, 0, .0015, cts.PUT)).toEqual(0);
      expect(greeks.getDelta(100, 100, 0, 0, .0015, cts.CALL)).toEqual(0);
      expect(greeks.getDelta(99.99, 100, 0, 0, .0015, cts.CALL)).toEqual(0);
      expect(greeks.getDelta(100, 100, 0, 0, .0015, cts.PUT)).toEqual(0);
      expect(greeks.getDelta(100.01, 100, 0, 0, .0015, cts.PUT)).toEqual(0);
    });
    it("should return 1 for calls, -1 for puts", function()
    {
      expect(greeks.getDelta(100.01, 100, 0, .1, .0015, cts.CALL)).toEqual(1);
      expect(greeks.getDelta(99.99, 100, 0, .1, .0015, cts.PUT)).toEqual(-1);
      expect(greeks.getDelta(100.01, 100, .1, 0, .0015, cts.CALL)).toEqual(1);
      expect(greeks.getDelta(99.99, 100, .1, 0, .0015, cts.PUT)).toEqual(-1);
      expect(greeks.getDelta(100.01, 100, 0, 0, .0015, cts.CALL)).toEqual(1);
      expect(greeks.getDelta(99.99, 100, 0, 0, .0015, cts.PUT)).toEqual(-1);
    });
  }); // end delta
  describe("Vega", function()
  {
    it("should return ~.24", function()
    {
      expect(greeks.getVega(206.35, 206, .086, .1, .0015)).toEqual(0.24070106056306836);
    });
    it("should return 0", function()
    {
      expect(greeks.getVega(100, 100, 0, .1, .0015)).toEqual(0);
      expect(greeks.getVega(100, 100, 0, 0, .0015)).toEqual(0);
      expect(greeks.getVega(100, 100, .1, 0, .0015)).toEqual(0);
    });
  }); // end vega
  describe("Gamma", function()
  {
    it("should return ~.065", function()
    {
      expect(greeks.getGamma(206.35, 206, .086, .1, .0015)).toEqual(0.06573105549942765);
    });
    it("should return 0", function()
    {
      expect(greeks.getGamma(100, 100, 0, .1, .0015)).toEqual(0);
      expect(greeks.getGamma(100, 100, .1, 0, .0015)).toEqual(0);
      expect(greeks.getGamma(100, 100, 0, 0, .0015)).toEqual(0);
    });
  }); // end gamma
  describe("Theta", function()
  {
    it("should return non-zero theta", function()
    {
      expect(greeks.getTheta(206.35, 206, .086, .1, .0015, cts.CALL)).toEqual( -0.03877971361524501);
      expect(greeks.getTheta(206.35, 206, .086, .1, .0015, cts.PUT)).toEqual(-0.0379332474739548);
      expect(greeks.getTheta(206.35, 206, .086, .1, .0015, cts.CALL, 252)).toEqual( -0.05616902964112869);
      expect(greeks.getTheta(206.35, 206, .086, .1, .0015, cts.PUT, 252)).toEqual( -0.054942997333307556);
    });
    it("should return 0", function()
    {
      expect(greeks.getTheta(100, 100, 0, .1, .0015, cts.CALL)).toEqual(0);
      expect(greeks.getTheta(100, 100, 0, .1, .0015, cts.PUT)).toEqual(0);
      expect(greeks.getTheta(100, 100, 0, .1, .0015, cts.CALL, 252)).toEqual(0);
      expect(greeks.getTheta(100, 100, 0, .1, .0015, cts.PUT, 252)).toEqual(0);
      expect(greeks.getTheta(100, 100, .1, 0, .0015, cts.CALL)).toEqual(0);
      expect(greeks.getTheta(100, 100, .1, 0, .0015, cts.PUT)).toEqual(0);
      expect(greeks.getTheta(100, 100, .1, 0, .0015, cts.CALL, 252)).toEqual(0);
      expect(greeks.getTheta(100, 100, .1, 0, .0015, cts.PUT, 252)).toEqual(0);
      expect(greeks.getTheta(100, 100, 0, 0, .0015, cts.CALL)).toEqual(0);
      expect(greeks.getTheta(100, 100, 0, 0, .0015, cts.PUT)).toEqual(0);
      expect(greeks.getTheta(100, 100, 0, 0, .0015, cts.CALL, 252)).toEqual(0);
      expect(greeks.getTheta(100, 100, 0, 0, .0015, cts.PUT, 252)).toEqual(0);
    });
  }); // end theta
  describe("Rho", function()
  {
    it("should return non-zero rho", function()
    {
      expect(greeks.getRho(206.35, 206, .086, .1, .0015, cts.CALL)).toEqual( 0.09193271711465777);
      expect(greeks.getRho(206.35, 206, .086, .1, .0015, cts.PUT)).toEqual(-0.08520443071933861);
      expect(greeks.getRho(206.35, 206, .086, .1, .0015, cts.CALL, 10000)).toEqual(0.0009193271711465777);
      expect(greeks.getRho(206.35, 206, .086, .1, .0015, cts.PUT, 10000)).toEqual(-0.0008520443071933862);
      // only the call has a non-zero rho when: v=0, t>0, s>k
      expect(greeks.getRho(206.35, 206, .086, 0, .0015, cts.CALL)).toEqual(0.17713714783399637);
      // only the put has a non-zero rho when: v=0, t>0, s<k
      expect(greeks.getRho(205.35, 206, .086, 0, .0015, cts.PUT)).toEqual(-0.17713714783399637);
    });
    it("should return 0", function()
    {
      expect(greeks.getRho(100, 100, 0, .1, .0015, cts.CALL)).toEqual(0);
      expect(greeks.getRho(100, 100, 0, .1, .0015, cts.PUT)).toEqual(0);
      expect(greeks.getRho(100, 100, 0, 0, .0015, cts.CALL)).toEqual(0);
      expect(greeks.getRho(100, 100, 0, 0, .0015, cts.PUT)).toEqual(0);
      // only the put has a rho of zero when: v=0, t>0, s>k
      expect(greeks.getRho(206.35, 206, .086, 0, .0015, cts.PUT)).toEqual(-0);
      // only the call has a rho of zero when: v=0, t>0, s<k
      expect(greeks.getRho(205.35, 206, .086, 0, .0015, cts.CALL)).toEqual(0);
    });
  }); // end rho
});