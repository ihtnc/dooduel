import Icon from "./";
import type { IconProps } from "./types";

export default function NameIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/name.png" alt={alt} className={className} />
  );
};