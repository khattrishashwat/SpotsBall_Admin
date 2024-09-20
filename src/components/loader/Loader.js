import React from "react";
import { PacmanLoader } from "react-spinners";

const Loader = ({ width }) => {
  return (
    <div
      style={{
        position: "absolute",
        top:"45%",
        left: "44%",
        zIndex:100
      }}
    >
      <PacmanLoader color="gold" />
    </div>
  );
};

export default Loader;
