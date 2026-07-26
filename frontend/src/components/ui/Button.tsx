import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: "primary" | "ghost";
}

export default function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // A ação primária do app é preta em todo lugar (navbar, landing, planos).
        // Antes este componente era azul, destoando de tudo à sua volta.
        "font-secondary inline-flex h-12 items-center justify-center rounded-full px-6",
        "text-sm font-medium tracking-wide transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-ink text-paper hover:bg-black",
        variant === "ghost" && "text-ink border border-black/15 hover:bg-black/5",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
