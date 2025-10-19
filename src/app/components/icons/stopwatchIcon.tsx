import Icon from "./";
import type { IconProps } from "./types";

export default function StopwatchIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/stopwatch.png" alt={alt} className={className} />
  );
};