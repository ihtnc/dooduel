import Button from ".";
import type { IconButtonProps } from "./types";

export default function InstructionsButton({
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
      imageSrc="/icons/instructions.png"
      imageAlt={imageAlt}
      disabled={disabled}
      type={type}
      className={className}
      imageClassName="-my-1 scale-90 group-hover:scale-110"
      childrenClassName="-ml-3 w-fit"
    >
      {children}
    </Button>
  );
}