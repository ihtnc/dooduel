import Icon from "./";
import type { IconProps } from "./types";

export default function MultiplayerIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/multiplayer.png" alt={alt} className={className} />
  );
};