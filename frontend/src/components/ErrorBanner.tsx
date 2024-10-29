import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

function ErrorBanner(props: { message: string }) {
  return (
    <div className="bg-destructive px-6 py-3 w-full text-foreground text-lg flex items-center justify-between gap-4 rounded-lg">
      Error: {props.message}
      <Link href="/">
        <Button variant="outline">Go back</Button>
      </Link>
    </div>
  );
}

export default ErrorBanner;
