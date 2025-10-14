import Icon from "./";
import type { IconProps } from "./types";

export default function BugIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/bug.png" alt={alt} className={className} />
  );
};