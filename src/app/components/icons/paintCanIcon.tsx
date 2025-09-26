import Icon from "./";
import type { IconProps } from "./types";

export default function PaintCanIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/paint-can.png" alt={alt} className={className} />
  );
};