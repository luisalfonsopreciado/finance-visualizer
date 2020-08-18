import React from "react";

const Error = (props) => {
  return (
    <div className="alert alert-danger " role="alert">
      <strong>{props.children}</strong>
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={props.removeFunc}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};
export default Error;
