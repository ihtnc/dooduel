import Icon from "./";
import type { IconProps } from "./types";

export default function ArtistIcon({
  alt,
  className
}: IconProps) {
  return (
    <Icon src="/icons/artist.png" alt={alt} className={className} />
  );
};