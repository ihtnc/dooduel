import { InputHTMLAttributes } from "react";
import { cn } from "@utilities/index";

export default function Slider({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input
    type="range"
    className={cn("border-4", "rounded-lg", "w-full", "h-2",
    "border-[#715A5A]", "accent-[#44444E]",
    "hover:border-[#44444E]", "hover:accent-[#715A5A]",
    "cursor-pointer", "appearance-none",
    className
    )}
    {...props}
  />;
};