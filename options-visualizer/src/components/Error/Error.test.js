import React from "react";
import Error from "./Error";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// Connect enzyme
configure({ adapter: new Adapter() });

describe("<Error />", () => {
  it("Should render an Error component", () => {
    const wrapper = shallow(<Error />);
    expect(wrapper).toBeDefined();
  });

  it("Should render the children prop", () => {
    const message = "Test Message";
    const wrapper = shallow(<Error>{message}</Error>);
    expect(wrapper.contains(<strong>{message}</strong>)).toEqual(true);
  });

  it("Should call the removeFunc when clicked", () => {
    const myMockFn = jest.fn();
    const wrapper = shallow(<Error removeFunc={myMockFn}></Error>);
    wrapper.find("button").invoke("onClick")();
    expect(myMockFn).toHaveBeenCalled();
  });
});
