import { cn } from "../../lib/utils";

function Card({ className, children }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Card };