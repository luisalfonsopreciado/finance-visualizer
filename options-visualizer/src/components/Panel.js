import React, { Component } from "react";

const Contract = (props) => {
  return (
    <tr>
      <td>
        <select id="direction" class="form-control">
          <option>Buy</option>
          <option>Sell</option>
        </select>
      </td>
      <td>
        <select class="form-control">
          <option>Call</option>
          <option>Put</option>
          <option>Cash</option>
        </select>
      </td>
      <td>
        <input
          type="number"
          placeholder="Strike"
          id="strike"
          class="form-control form-control-inline"
        />
      </td>
      <td>
        <input
          type="datetime"
          placeholder="Expiry"
          id="expiry"
          class="form-control form-control-inline"
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
        >
          <span aria-hidden="true" class="glyphicon glyphicon-trash"></span>
        </button>
      </td>
    </tr>
  );
};

const DUMMY_DATA = [1, 2, 3, 4];

const Panel = (props) => {
  const { portfolio } = props;
  return (
    <div class="panel panel-primary">
      <div class="panel-heading">Panel</div>
      <div class="panel-body">
        <table class="table table-condensed">
          <thead>
            <tr>
              <th>Direction</th> <th>Kind</th> <th>Strike</th> <th>Expiry</th>
              <th>Price</th>
              <th>
                <button type="submit" class="btn btn-success btn-xs">
                  Add Leg
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <Contract />
            {/* {DUMMY_DATA.map((i) => (
              <Contract />
            ))} */}
          </tbody>
        </table>
        <div class="pull-right">
          <button type="submit" class="btn btn-success btn-xs">
            Generate Payoff
          </button>
        </div>
      </div>
    </div>
  );
};

export default Panel;
