import * as React from "react";

const Button = React.forwardRef(({ className = "", variant = "default", size = "default", disabled, children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        default: "bg-slate-900 text-white hover:bg-slate-700",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-slate-200 hover:bg-slate-100 hover:text-slate-900",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
        link: "underline-offset-4 hover:underline text-slate-900",
    };

    const sizes = {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
    };

    return (
        <button
            ref={ref}
            className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
