import React from "react";

function H1(props: { children: string }) {
  return <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">{props.children}</h1>;
}

export default H1;
