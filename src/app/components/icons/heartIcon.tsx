import Icon from "./";
import type { IconProps } from "./types";

export default function HeartIcon({
  alt,
  className,
  onClick
}: IconProps) {
  return (
    <Icon src="/icons/heart.png" alt={alt} className={className} onClick={onClick} />
  );
};