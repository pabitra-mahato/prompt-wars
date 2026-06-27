import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-600/10":
              variant === 'default',
            "bg-rose-600 text-white hover:bg-rose-500 shadow-sm shadow-rose-600/10":
              variant === 'destructive',
            "border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300":
              variant === 'outline',
            "bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-50 hover:bg-slate-200/80 dark:hover:bg-slate-800/80":
              variant === 'secondary',
            "hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300":
              variant === 'ghost',
            "text-emerald-600 hover:underline underline-offset-4":
              variant === 'link',
          },
          {
            "h-10 px-4 py-2": size === 'default',
            "h-8 rounded-lg px-3 text-xs": size === 'sm',
            "h-12 rounded-xl px-8 text-base": size === 'lg',
            "h-10 w-10": size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
