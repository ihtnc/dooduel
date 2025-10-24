"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrushesIcon from '@/components/icons/brushesIcon';
import CodeIcon from '@/components/icons/codeIcon';
import BugIcon from '@/components/icons/bugIcon';
import InstructionsIcon from '@/components/icons/instructionsIcon';
import { cn } from '@utilities/index';

const Footer = () => {
  const pathName = usePathname();

  const howToPlayLink = pathName === "/" ? "/how-to-play" : `/how-to-play?prev=${pathName}`;
  const isHowToPlay = pathName === "/how-to-play";

  return (
    <footer className="bottom-0 flex flex-col items-center p-4 gap-1 justify-center text-sm">
      <div className="flex flex-row gap-2">
        <Link href={howToPlayLink} rel="noopener noreferrer"
          className={cn("flex", "flex-row", "items-center", "group",
            "hover:underline", "gap-1", "underline-offset-4",
            "font-bold", "text-[var(--primary)]",
            { "pointer-events-none text-inherit": isHowToPlay }
          )}
          tabIndex={isHowToPlay ? -1 : 0}>
          <InstructionsIcon alt="How to play" className="size-6 group-hover:scale-120 -ml-1" />
          How to play
        </Link>
        <span className="scale-75 self-center font-bold text-[var(--primary)]">|</span>
        <div className="flex items-center">
          <BrushesIcon alt="Dooduel logo" className="size-6 mr-1" />
          <span className="font-primary -mb-1">Dooduel &copy;</span>
          &nbsp;by&nbsp;
          <Link href="https://github.com/ihtnc" className="hover:underline font-bold text-[var(--primary)] underline-offset-4" target="blank" rel="noopener noreferrer">ihtnc</Link>
        </div>
        <span className="scale-75 self-center font-bold text-[var(--primary)]">|</span>
        <Link href="https://github.com/ihtnc/dooduel" target="blank" rel="noopener noreferrer"
          className="flex flex-row items-center group hover:underline gap-1 font-bold text-[var(--primary)] underline-offset-4">
          <CodeIcon alt="Code" className="size-6 group-hover:scale-120 -ml-1" />
          Code
        </Link>
        <span className="scale-75 self-center font-bold text-[var(--primary)]">|</span>
        <Link href="https://github.com/ihtnc/dooduel/issues" target="blank" rel="noopener noreferrer"
          className="flex flex-row items-center group hover:underline gap-1 font-bold text-[var(--primary)] underline-offset-4">
          <BugIcon alt="Issues" className="size-6 mt-1 group-hover:scale-120" />
          Bug?
        </Link>
      </div>
    </footer>
  );
};

export default Footer;