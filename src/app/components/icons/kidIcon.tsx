import Icon from "./";
import type { IconProps } from "./types";

export default function KidIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/kid.png" alt={alt} className={className} />
  );
};