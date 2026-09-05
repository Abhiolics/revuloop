"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  error?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, error, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-[14px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block",
        error ? "text-[var(--destructive)]" : "text-[var(--foreground)]",
        className
      )}
      {...props}
    />
  )
)
Label.displayName = "Label"

export { Label }
