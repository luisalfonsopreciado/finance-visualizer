import * as cts from "./constants";

// Option definition class
export default class Option {
  constructor(contractName) {
    this.contractName = contractName;
    this.strike = "";
    this.date = "";
    this.direction = cts.BUY;
    this.type = cts.CALL;
    this.amount = 1;
  }
}
