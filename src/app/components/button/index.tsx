import Image from "next/image";
import { ReactNode } from "react";
import { cn } from "@utilities/index";

export default function Button({
  children,
  onClick,
  imageSrc,
  imageAlt,
  disabled = false,
  type = "button",
  className = "",
  imageClassName = "",
  childrenClassName = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  imageSrc?: string;
  imageAlt?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  imageClassName?: string;
  childrenClassName?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn("border-4 border-[#715A5A]", "font-bold", "rounded",
        "hover:border-[#44444E]", "hover:bg-[#715A5A]", "hover:text-white",
        "dark:hover:bg-[#44444E]",
        "disabled:opacity-50", "disabled:cursor-not-allowed",
        "cursor-pointer", "group",
        "py-1", "gap-3",
        "flex", "items-center", "justify-center",
        ...className.split(" ")
      )}
      disabled={disabled}
      type={type}
    >
      {imageSrc && (
        <Image src={imageSrc} alt={imageAlt || imageSrc} width={50} height={50}
          className={cn("group-hover:scale-120",
            ...imageClassName.split(" ")
          )}
        />
      )}
      {children && (
        <div className={cn("text-start", "w-20", ...childrenClassName.split(" "))}>
          {children}
        </div>
      )}
    </button>
  );
}