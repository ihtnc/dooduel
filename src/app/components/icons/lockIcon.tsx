import Icon from "./";
import type { IconProps } from "./types";

export default function LockIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/lock.png" alt={alt} className={className} />
  );
};