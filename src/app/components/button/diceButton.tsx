import Button from ".";
import type { IconButtonProps } from "./types";

export default function DiceButton({
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
      imageSrc="/icons/dice.png"
      imageAlt={imageAlt}
      disabled={disabled}
      type={type}
      className={className}
      imageClassName="-my-1 scale-120 group-hover:scale-140"
      childrenClassName="-ml-2"
    >
      {children}
    </Button>
  );
}