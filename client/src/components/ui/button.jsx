import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-lg",
    "px-4 py-2",
    "text-sm font-semibold",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/30",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md",

        outline:
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300",

        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900",

        secondary:
          "bg-slate-100 text-slate-700 hover:bg-slate-200",

        danger:
          "bg-red-600 text-white hover:bg-red-700",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

function Button({
  className,
  variant,
  ...props
}) {
  return (
    <button
      className={cn(
        buttonVariants({ variant }),
        className
      )}
      {...props}
    />
  );
}

export { Button };