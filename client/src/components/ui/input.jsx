import { cn } from "../../lib/utils";

function Input({
  className,
  ...props
}) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500",
        className
      )}
      {...props}
    />
  );
}

export { Input };