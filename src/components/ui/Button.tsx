import { cn } from "@/lib/utils";
import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: "glass-button font-medium rounded-lg",
            secondary: "bg-white/5 hover:bg-white/10 text-white/80 border border-white/10",
            danger: "bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30",
            ghost: "bg-transparent hover:bg-white/5 border-transparent text-white/70 hover:text-white",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
