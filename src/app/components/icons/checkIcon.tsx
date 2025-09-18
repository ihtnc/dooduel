import Icon from "./";
import type { IconProps } from "./types";

export default function CheckIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/check.png" alt={alt} className={className} />
  );
};