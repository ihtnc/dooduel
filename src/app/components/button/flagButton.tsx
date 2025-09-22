import Button from ".";
import type { IconButtonProps } from "./types";

export default function FlagButton({
  children,
  onClick,
  disabled,
  type,
  imageAlt,
  className
}: IconButtonProps) {
  return (
    <Button
      onClick={onClick}
      imageSrc="/icons/flag.png"
      imageAlt={imageAlt}
      disabled={disabled}
      type={type}
      className={className}
      imageClassName="-my-1 ml-2 scale-90 group-hover:scale-110"
      childrenClassName="-ml-3"
    >
      {children}
    </Button>
  );
}