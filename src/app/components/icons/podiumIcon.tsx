import Icon from "./";
import type { IconProps } from "./types";

export default function PodiumIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/podium.png" alt={alt} className={className} />
  );
};