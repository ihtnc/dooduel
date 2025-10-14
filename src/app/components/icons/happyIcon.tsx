import Icon from "./";
import type { IconProps } from "./types";

export default function HappyIcon({
  alt,
  className,
  onClick
}: IconProps) {
  return (
    <Icon src="/icons/happy.png" alt={alt} className={className} onClick={onClick} />
  );
};