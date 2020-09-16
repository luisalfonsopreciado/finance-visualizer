import { SET_INFO } from "../actions/strategy-info";

const initialState = {
  info: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_INFO:
      return { info: action.info };
    default:
      return initialState;
  }
};
