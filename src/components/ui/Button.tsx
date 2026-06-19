import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90": variant === "default",
            "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90": variant === "destructive",
            "border border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-sm hover:bg-white/60 dark:hover:bg-white/10": variant === "outline",
            "bg-secondary/70 text-secondary-foreground shadow-sm backdrop-blur-md hover:bg-secondary/90": variant === "secondary",
            "hover:bg-accent/50 hover:text-accent-foreground backdrop-blur-sm": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "h-11 sm:h-10 px-4 sm:px-5 py-2": size === "default",
            "h-10 sm:h-9 rounded-lg px-3": size === "sm",
            "h-14 sm:h-12 rounded-2xl px-6 sm:px-8 text-base": size === "lg",
            "h-11 w-11 sm:h-10 sm:w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
