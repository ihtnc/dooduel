import Icon from "./";
import type { IconProps } from "./types";

export default function EaselIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/easel.png" alt={alt} className={className} />
  );
};