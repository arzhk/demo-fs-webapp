import { cn } from "@/lib/utils";
import React from "react";

function P(props: { children: string | string[]; className?: string }) {
  return <p className={cn("leading-7", props.className)}>{props.children}</p>;
}

export default P;
