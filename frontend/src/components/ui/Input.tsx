import { type InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fill?: boolean;
}

export default function Input({ fill = false, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "font-secondary h-12 w-full rounded-lg border px-3 text-sm",
        "border-black/15 placeholder:text-ink-faint transition-colors",
        "hover:border-black/30",
        // Sem focus:outline-none aqui: o anel de foco global (:focus-visible)
        // é o que dá rastro para quem navega por teclado.
        "focus:border-accent",
        fill && "bg-black/[0.03]",
        className,
      )}
      {...props}
    />
  );
}
