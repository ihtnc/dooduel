import { InputHTMLAttributes } from "react";
import { cn } from "@utilities/index";

export default function Slider({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input
    type="range"
    className={cn("border-4", "rounded-lg", "w-full", "h-2",
    "border-[color:var(--primary)]", "accent-[color:var(--secondary)]",
    "hover:border-[color:var(--secondary)]", "hover:accent-[color:var(--primary)]",
    "cursor-pointer", "appearance-none",
    className
    )}
    {...props}
  />;
};