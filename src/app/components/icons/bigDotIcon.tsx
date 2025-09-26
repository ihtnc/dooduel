import Icon from "./";
import type { IconProps } from "./types";

export default function BigDotIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/big-dot.png" alt={alt} className={className} />
  );
};