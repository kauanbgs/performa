import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "ghost"; // Add other variants if needed
}

export default function Button({
  className,
  variant = "default",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded transition-colors",
        variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "ghost" && "bg-transparent text-gray-700 hover:bg-gray-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
