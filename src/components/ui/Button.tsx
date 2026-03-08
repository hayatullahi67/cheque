'use client';

import { cn } from "@/lib/helpers";
import { Loader2 } from "lucide-react";
import { HTMLMotionProps, motion } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children?: React.ReactNode;
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-95",
        secondary: "bg-white text-zinc-900 border border-zinc-200 shadow-sm hover:bg-zinc-50 active:scale-95",
        outline: "bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-95",
        ghost: "bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
        danger: "bg-red-600 text-white shadow-lg shadow-red-100 hover:bg-red-700 active:scale-95"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs font-bold",
        md: "px-6 py-2.5 text-sm font-bold",
        lg: "px-8 py-4 text-base font-black tracking-tight"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={cn(
                "inline-flex items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {children}
        </motion.button>
    );
}
