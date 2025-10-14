import Icon from "./";
import type { IconProps } from "./types";

export default function TrophyIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/trophy.png" alt={alt} className={className} />
  );
};