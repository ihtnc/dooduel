import { ReactNode, useEffect, useState } from "react";
import { cn } from "@utilities/index";

export default function TextOverlay({
  text,
  children,
  className,
  textClassName,
  showText,
  onTextHidden
}: {
  text?: string;
  children?: ReactNode;
  className?: string;
  textClassName?: string;
  showText?: boolean;
  onTextHidden?: () => void;
}) {
  const [showCopyText, setShowCopyText] = useState<boolean>(showText || false);

  useEffect(() => {
    setShowCopyText(showText || false);

    if (showText) {
      setTimeout(() => {
        setShowCopyText(false);
        onTextHidden?.();
      }, 1500);
    }
  }, [showText, onTextHidden]);

  return (
    <div
      className={cn("relative", "fit-content",
        "justify-center", "items-center",
        className?.split(" ") || [])
    }>
      <span className={
        cn("absolute",
          "top-1/2", "left-1/2", "transform", "-translate-x-1/2", "-translate-y-1/2",
          "text-center", "first-letter:capitalize",
          "transition-opacity", "duration-300", "ease-in",
          { "opacity-100 z-50": showCopyText },
          { "opacity-0 z-10": !showCopyText },
          textClassName?.split(" ") || []
        )}>{text}</span>
      <span className={cn("absolute", "flex", "items-center",
        "transition-opacity", "duration-300", "ease-out",
        { "opacity-0 z-10 cursor-default pointer-events-none": showCopyText },
        { "opacity-100 z-50": !showCopyText })
      }>
        {children}
      </span>
    </div>
  );
};