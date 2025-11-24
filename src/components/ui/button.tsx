import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-button text-white rounded-[14px] shadow-lg hover:shadow-xl hover:scale-[1.04] active:scale-[0.98] transition-all duration-120",
        destructive: "bg-destructive text-destructive-foreground rounded-[14px] shadow-lg hover:shadow-xl hover:scale-[1.04] active:scale-[0.98]",
        outline: "border-2 border-secondary bg-transparent text-secondary-foreground rounded-[14px] hover:bg-secondary/10 hover:border-secondary/80",
        secondary: "bg-secondary text-secondary-foreground rounded-[14px] hover:bg-secondary/80",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground rounded-[14px]",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-button text-white rounded-[14px] shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-[12px] px-4",
        lg: "h-12 rounded-[14px] px-8 text-base",
        icon: "h-10 w-10 rounded-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
