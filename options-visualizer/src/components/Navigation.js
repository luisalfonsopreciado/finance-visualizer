import React from "react";
import {
  Navbar,
  Nav,
  FormControl,
  Form,
  Button,
  NavDropdown,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

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
      />{' '}
      Options Visualizer
    </Navbar.Brand>
  </Navbar>
  );
};

export default Navigation;
