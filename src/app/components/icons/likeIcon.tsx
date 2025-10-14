import Icon from "./";
import type { IconProps } from "./types";

export default function LikeIcon({
  alt,
  className,
  onClick
}: IconProps) {
  return (
    <Icon src="/icons/like.png" alt={alt} className={className} onClick={onClick} />
  );
};