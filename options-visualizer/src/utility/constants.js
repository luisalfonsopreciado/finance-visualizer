import moment from "moment";
export const BUY = "Buy";
export const SELL = "Sell";
export const CALL = "Call";
export const PUT = "Put";
export const CASH = "Cash";

const date = moment(new Date(Date.now() + 604800000)).format("YYYY-MM-DD");
const direction = "Buy";
const test = {
  date,
};

export const initialPortfolio = {
  "2020-08-12T19:58:01.033Z": {
    amount: 1,
    contractName: "2020-08-12T19:58:01.033Z",
    date,
    direction,
    price: "", // To be calculated in the Contract Component
    strike: 100,
    type: "Call",
  },
};

// export const longCondor = {
//   "2020-08-12T19:58:01.033Z" : {
//     amount: 1,
//     contractName: ,
//     date: ""
//   }
// }
