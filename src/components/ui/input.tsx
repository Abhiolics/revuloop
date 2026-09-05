import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[46px] w-full rounded-[10px] border border-[var(--border-color)] bg-[var(--surface)] px-4 py-2 text-[15px] ring-offset-[var(--background)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--muted-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--persimmon)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
