import React, { Component } from "react";

class StockData extends Component {
  render() {
    const { data, setPrice } = this.props;

    return (
      <div class="panel panel-primary">
        <div class="panel-heading">Underlying stock</div>
        <div class="panel-body">
          <form class="form-horizontal">
            <div class="form-group">
              <label class="col-sm-5 control-label">Current price</label>
              <div class="col-sm-7">
                <input
                  type="text"
                  placeholder="CurrentPrice"
                  class="form-control"
                  value={data.price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-5 control-label">Volatility</label>
              <div class="col-sm-7">
                <input
                  type="text"
                  placeholder="Volatility"
                  class="form-control"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-5 control-label">Interest Rate</label>
              <div class="col-sm-7">
                <input
                  type="text"
                  placeholder="Interest Rate"
                  class="form-control"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default StockData;
