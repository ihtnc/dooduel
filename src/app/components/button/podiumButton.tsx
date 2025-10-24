import Button from ".";
import type { IconButtonProps } from "./types";

export default function PodiumButton({
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
      imageSrc="/icons/podium.png"
      imageAlt={imageAlt}
      disabled={disabled}
      type={type}
      className={className}
      imageClassName="-mt-2 -ml-4 scale-100 group-hover:scale-120"
      childrenClassName="-ml-2"
    >
      {children}
    </Button>
  );
}