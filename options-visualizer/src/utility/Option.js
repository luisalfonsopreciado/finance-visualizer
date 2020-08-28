import * as cts from "./constants";

// Option definition class
export default class Option {
  constructor(contractName) {
    this.contractName = new Date().toISOString()
    this.strike = 100;
    this.date = cts.date;
    this.direction = cts.BUY;
    this.type = cts.CALL;
    this.amount = 1;
    this.debitCredit = 0;
  }
}
