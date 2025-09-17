import Button from ".";
import type { IconButtonProps } from "./types";

export default function RightButton({
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
      imageSrc="/icons/right.png"
      imageAlt={imageAlt}
      disabled={disabled}
      type={type}
      className={className}
      imageClassName="-my-1 scale-80 group-hover:scale-100"
      childrenClassName="-ml-2"
    >
      {children}
    </Button>
  );
}