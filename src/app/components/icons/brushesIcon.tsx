import Icon from "./";
import type { IconProps } from "./types";

export default function BrushesIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/brushes.png" alt={alt} className={className} />
  );
};