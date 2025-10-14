import Icon from "./";
import type { IconProps } from "./types";

export default function DisappointedIcon({
  alt,
  className,
  onClick
}: IconProps) {
  return (
    <Icon src="/icons/disappointed.png" alt={alt} className={className} onClick={onClick} />
  );
};