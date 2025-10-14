import Icon from "./";
import type { IconProps } from "./types";

export default function SurprisedIcon({
  alt,
  className,
  onClick
}: IconProps) {
  return (
    <Icon src="/icons/surprised.png" alt={alt} className={className} onClick={onClick} />
  );
};