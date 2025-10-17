import Button from ".";
import type { IconButtonProps } from "./types";

export default function LightbulbButton({
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
      imageSrc="/icons/lightbulb.png"
      imageAlt={imageAlt}
      disabled={disabled}
      type={type}
      className={className}
      imageClassName="-mt-2 -ml-4 scale-75 group-hover:scale-95"
      childrenClassName="-ml-3"
    >
      {children}
    </Button>
  );
}