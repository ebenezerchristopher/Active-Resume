import { DotsSixVerticalIcon } from "@phosphor-icons/react";
import { cn } from "@active-resume/utils";
import * as PanelPrimitive from "react-resizable-panels";

export const PanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof PanelPrimitive.Group>) => (
  <PanelPrimitive.Group className={cn("flex h-full w-full", className)} {...props} />
);

export const Panel = PanelPrimitive.Panel;

export const PanelResizeHandle = ({
  className,
  ...props
}: React.ComponentProps<typeof PanelPrimitive.Separator>) => (
  <PanelPrimitive.Separator
    className={cn(
      "relative z-[100] flex w-px items-center justify-center data-[separator=inactive]:outline-none data-[separator=inactive]:outline-0 data-[separator=inactive]:outline-transparent",
      className,
    )}
    {...props}
  >
    <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm">
      <DotsSixVerticalIcon className="h-2.5 w-2.5" />
    </div>
  </PanelPrimitive.Separator>
);
