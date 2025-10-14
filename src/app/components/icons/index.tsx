import Image from "next/image";
import { cn } from "@utilities/index";

export default function Icon({
  src,
  alt,
  onClick,
  className = ""
}: {
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Image src={src} alt={alt || src} width={50} height={50}
      onClick={onClick}
      className={cn("", ...className.split(" "))} />
  );
}