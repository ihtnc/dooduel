import Button from ".";
import type { IconButtonProps } from "./types";

export default function ProfileCheckButton({
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
      imageSrc="/icons/profile-check.png"
      imageAlt={imageAlt}
      disabled={disabled}
      type={type}
      className={className}
      imageClassName="-my-1 scale-70 group-hover:scale-90"
      childrenClassName="-ml-4"
    >
      {children}
    </Button>
  );
}