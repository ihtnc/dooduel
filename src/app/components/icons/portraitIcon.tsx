import Icon from "./";
import type { IconProps } from "./types";

export default function PortraitIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/portrait.png" alt={alt} className={className} />
  );
};