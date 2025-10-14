import Icon from "./";
import type { IconProps } from "./types";

export default function ConfusedIcon({
  alt,
  className,
  onClick
}: IconProps) {
  return (
    <Icon src="/icons/confused.png" alt={alt} className={className} onClick={onClick} />
  );
};