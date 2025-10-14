import Button from ".";
import type { IconButtonProps } from "./types";

export default function TrophyButton({
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
      imageSrc="/icons/trophy.png"
      imageAlt={imageAlt}
      disabled={disabled}
      type={type}
      className={className}
      imageClassName="-mt-2 scale-90 group-hover:scale-110"
      childrenClassName="-ml-2"
    >
      {children}
    </Button>
  );
}