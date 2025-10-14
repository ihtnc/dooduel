import Icon from "./";
import type { IconProps } from "./types";

export default function StarIcon({
  alt,
  className,
  onClick
}: IconProps) {
  return (
    <Icon src="/icons/star.png" alt={alt} className={className} onClick={onClick} />
  );
};