import Icon from "./";
import type { IconProps } from "./types";

export default function SmallDotIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/small-dot.png" alt={alt} className={className} />
  );
};