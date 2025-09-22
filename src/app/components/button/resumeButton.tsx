import Button from ".";
import type { IconButtonProps } from "./types";

export default function ResumeButton({
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
      imageSrc="/icons/resume.png"
      imageAlt={imageAlt}
      disabled={disabled}
      type={type}
      className={className}
      imageClassName="-my-1 scale-70 group-hover:scale-90"
      childrenClassName="-ml-3"
    >
      {children}
    </Button>
  );
}