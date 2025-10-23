import { InputHTMLAttributes } from "react";
import { cn } from "@utilities/index";

export default function TextBox({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input
    className={cn("border", "rounded", "p-2",
    className
    )}
    onFocus={(e) => { e.target.select(); }}
    onClick={(e) => { e.currentTarget.select(); }}
    {...props}
  />;
};