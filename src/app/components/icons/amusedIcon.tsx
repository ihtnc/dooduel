import Icon from "./";
import type { IconProps } from "./types";

export default function AmusedIcon({
  alt,
  className,
  onClick
}: IconProps) {
  return (
    <Icon src="/icons/amused.png" alt={alt} className={className} onClick={onClick} />
  );
};