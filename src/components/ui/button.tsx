import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-persimmon disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--persimmon)] text-[#FFFEFA] hover:bg-[var(--dark-persimmon)] border border-transparent shadow-sm",
        destructive: "bg-[var(--destructive)] text-white hover:bg-red-700 shadow-sm",
        outline: "border border-[var(--border-color)] bg-transparent hover:bg-[var(--surface-secondary)] text-[var(--foreground)]",
        secondary: "bg-[var(--surface-secondary)] text-[var(--foreground)] hover:bg-[var(--border-color)]",
        ghost: "hover:bg-[var(--surface-secondary)] text-[var(--foreground)]",
        link: "text-[var(--persimmon)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[46px] px-5 py-2",
        sm: "h-9 rounded-[8px] px-3 text-sm",
        lg: "h-[50px] rounded-[12px] px-8 text-[16px]",
        icon: "h-[46px] w-[46px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // If it's a child slot, we don't automatically get Framer Motion support unless we wrap it
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      )
    }

    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
