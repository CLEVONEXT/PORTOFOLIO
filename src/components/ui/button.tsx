import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[rgb(var(--cta))] text-[rgb(var(--cta-fg))] hover:bg-[rgb(var(--surface2))]",
        accent:
          "bg-[rgb(var(--cta))] text-[rgb(var(--cta-fg))] hover:bg-[rgb(var(--ink-mute))]",
        glass:
          "border border-[rgb(var(--line))] bg-[rgb(var(--surface))] text-foreground hover:border-[rgb(var(--line-strong))] hover:text-[rgb(var(--ink))]",
        outline:
          "border border-[rgb(var(--line))] bg-transparent text-foreground hover:border-[rgb(var(--line))] hover:bg-[rgb(var(--surface))]",
        ghost: "text-muted-foreground hover:bg-[rgb(var(--surface))] hover:text-foreground",
        destructive:
          "bg-destructive/90 text-destructive-foreground hover:bg-destructive",
        link: "text-[rgb(var(--ink))] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-7 text-[0.95rem]",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
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
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };