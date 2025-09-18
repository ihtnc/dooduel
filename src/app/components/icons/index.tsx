import Image from "next/image";
import { cn } from "@utilities/index";

export default function Icon({
  src,
  alt,
  className = ""
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <Image src={src} alt={alt || src} width={50} height={50}
      className={cn("", ...className.split(" "))} />
  );
}