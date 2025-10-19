import Icon from "./";
import type { IconProps } from "./types";

export default function TargetIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/target.png" alt={alt} className={className} />
  );
};