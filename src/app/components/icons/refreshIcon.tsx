import Icon from "./";
import type { IconProps } from "./types";

export default function RefreshIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/refresh.png" alt={alt} className={className} />
  );
};