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
      className={cn("border-4 border-[color:var(--primary)]", "font-bold", "rounded-xl",
        "hover:border-[color:var(--secondary)]", "hover:bg-[color:var(--primary)]", "hover:text-white",
        "dark:hover:bg-[color:var(--secondary)]",
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