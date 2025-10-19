import Icon from "./";
import type { IconProps } from "./types";

export default function InstructionsIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/instructions.png" alt={alt} className={className} />
  );
};