import { cn } from "../../lib/utils";

function Card({
  className,
  children,
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white shadow-md p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Card };