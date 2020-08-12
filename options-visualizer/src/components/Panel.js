import React, { useCallback } from "react";
import Option from "../utility/Option";

const Contract = (props) => {
  const { removeContract, data, updateContract } = props;

  return (
    <tr>
      <td>
        <select
          id="direction"
          class="form-control"
          onChange={(e) =>
            updateContract(data.contractName, "direction", e.target.value)
          }
        >
          <option>Buy</option>
          <option>Sell</option>
        </select>
      </td>
      <td>
        <input
          type="number"
          placeholder="Amount"
          class="form-control form-control-inline"
          onChange={(e) =>
            updateContract(data.contractName, "amount", e.target.value)
          }
          value={data.amount}
        />
      </td>
      <td>
        <select
          class="form-control"
          onChange={(e) =>
            updateContract(data.contractName, "type", e.target.value)
          }
        >
          <option>Call</option>
          <option>Put</option>
          <option>Cash</option>
        </select>
      </td>
      <td>
        <input
          type="number"
          placeholder="Strike"
          class="form-control form-control-inline"
          onChange={(e) =>
            updateContract(data.contractName, "strike", e.target.value)
          }
          value={data.strike}
        />
      </td>
      <td>
        <input
          type="date"
          placeholder="Expiry"
          class="form-control form-control-inline"
          onChange={(e) =>
            updateContract(data.contractName, "date", e.target.value)
          }
          value={data.date}
        />
      </td>
      <td style={{ verticalAlign: "middle" }}>
        <b>0.00</b>
      </td>
      <td style={{ verticalAlign: "middle" }}>
        <b>1.00</b>
      </td>
      <td style={{ verticalAlign: "middle" }}>
        <button
          type="button"
          aria-label="Left Align"
          class="btn btn-danger btn-xs"
          onClick={() => removeContract(data.contractName)}
        >
          <span aria-hidden="true" class="glyphicon glyphicon-trash"></span>
        </button>
      </td>
    </tr>
  );
};

const DUMMY_DATA = [1, 2, 3, 4];

const Panel = (props) => {
  const { portfolio, setPortfolio, visualize } = props;

  const addOption = () => {
    const id = new Date().toISOString();
    portfolio[id] = new Option(id);
    setPortfolio(portfolio);
  };

  const renderContracts = useCallback(() => {
    const result = [];
    for (let id in portfolio) {
      result.push(
        <Contract
          removeContract={removeContract}
          updateContract={updateContract}
          data={portfolio[id]}
        />
      );
    }
    return result;
  }, []);

  const updateContract = (id, property, value) => {
    portfolio[id][property] = value;
    setPortfolio(portfolio);
  };

  const removeContract = (id) => {
    delete portfolio[id];
    setPortfolio(portfolio);
  };

  return (
    <div class="panel panel-primary">
      <div class="panel-heading">Panel</div>
      <div class="panel-body">
        <table class="table table-condensed">
          <thead>
            <tr>
              <th>Direction</th> <th>Amount</th>
              <th>Kind</th> <th>Strike</th> <th>Expiry</th>
              <th>Price</th>
              <th>
                <button
                  type="submit"
                  class="btn btn-success btn-xs"
                  onClick={addOption}
                >
                  Add Leg
                </button>
              </th>
            </tr>
          </thead>
          <tbody>{renderContracts()}</tbody>
        </table>
        <div class="pull-right">
          <button
            type="submit"
            class="btn btn-success btn-xs"
            onClick={visualize}
          >
            Generate Payoff
          </button>
        </div>
      </div>
    </div>
  );
};

export default Panel;
