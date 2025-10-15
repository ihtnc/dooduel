import Icon from "./";
import type { IconProps } from "./types";

export default function BrushIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/broken-brush.png" alt={alt} className={className} />
  );
};