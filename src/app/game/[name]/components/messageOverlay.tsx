"use client";

import { ReactNode, useEffect, useState } from "react";
import { cn } from "@utilities/index";

export default function MessageOverlay({
  children,
  containerClassName,
  childrenClassName,
  fadeDelayMs = 2000,
  fadeDurationMs = 3000,
  visible = true,
  disableFade = false,
  onFadeComplete
}: {
  children?: ReactNode;
  containerClassName?: string;
  childrenClassName?: string;
  fadeDelayMs?: number;
  fadeDurationMs?: number;
  visible?: boolean;
  disableFade?: boolean;
  onFadeComplete?: () => void;
}) {
  const [fadeStarted, setFadeStarted] = useState(false);

  useEffect(() => {
    if (!visible || disableFade) { return; }

    const delayTimer = setTimeout(() => {
      setFadeStarted(true);
    }, fadeDelayMs);

    const fadeTimer = setTimeout(() => {
      setFadeStarted(false);
      onFadeComplete?.();
    }, fadeDelayMs + fadeDurationMs);

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(fadeTimer);
    };
  }, [visible, disableFade, fadeDelayMs, fadeDurationMs, onFadeComplete]);

  if (!visible) { return null; }

  return (
    <div className="relative flex">
      <div
        className={cn("absolute", "top-0", "left-0", "flex",
          "items-center", "justify-center", "backdrop-blur-xs",
          "transition-opacity",
          `duration-${fadeDurationMs}`,
          fadeStarted ? "opacity-0" : "opacity-100",
          "pointer-events-none",
          containerClassName?.split(" ") ?? []
        )}
        style={{ zIndex: 1000 }}
      >
        <div className={cn("p-4", "rounded",
          childrenClassName?.split(" ") ?? []
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};
