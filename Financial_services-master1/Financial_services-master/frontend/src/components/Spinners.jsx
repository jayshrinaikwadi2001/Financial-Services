import React from "react";
import { css } from "@emotion/react";
import { BarLoader } from "react-spinners";

const spinnerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Spinners = () => {
  return (
    <div className="spinner" css={spinnerStyle}>
      <BarLoader color={"#123abc"} loading={true} />
    </div>
  );
};

export default Spinners;
