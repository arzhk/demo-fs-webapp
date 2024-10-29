import React from "react";

function P(props: { children: string }) {
  return <p className="leading-7">{props.children}</p>;
}

export default P;
