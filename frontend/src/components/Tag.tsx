import { cn } from "@/lib/utils";
import React from "react";

function Tag(props: { children: string; className?: string }) {
  return <div className={cn("rounded-full w-fit px-4 py-1 font-medium", props.className)}>{props.children}</div>;
}

export default Tag;
