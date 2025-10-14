import Icon from "./";
import type { IconProps } from "./types";

export default function CodeIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/code.png" alt={alt} className={className} />
  );
};