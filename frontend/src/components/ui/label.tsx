import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "./utils";

function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const { className, children, ...rest } = props;

  return (
    <LabelPrimitive.Root
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none",
        className,
      )}
      {...(rest as any)}
    >
      {children}
    </LabelPrimitive.Root>
  );
}

export { Label };

