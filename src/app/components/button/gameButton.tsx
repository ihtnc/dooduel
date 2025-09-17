import Button from ".";
import type { IconButtonProps } from "./types";

export default function GameButton({
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
      imageSrc="/icons/game.png"
      imageAlt={imageAlt}
      disabled={disabled}
      type={type}
      className={className}
      imageClassName="-mt-2"
    >
      {children}
    </Button>
  );
}