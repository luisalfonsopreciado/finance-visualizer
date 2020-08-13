import React from "react";
import { Navbar, Nav } from "react-bootstrap";

// import "bootstrap/dist/css/bootstrap.min.css";

const Navigation = (props) => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">
        <img
          alt=""
          src="/logo.svg"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{" "}
        Options Visualizer
      </Navbar.Brand>
      <Nav>
        <div className="custom-control custom-switch">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customSwitch1"
          ></input>
          <label className="custom-control-label" for="customSwitch1">
            Live Data Mode
          </label>
        </div>
      </Nav>
    </Navbar>
  );
};

export default Navigation;
