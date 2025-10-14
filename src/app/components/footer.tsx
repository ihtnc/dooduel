"use client";

import React from 'react';
import Link from 'next/link';
import BrushesIcon from '@/components/icons/brushesIcon';
import CodeIcon from '@/components/icons/codeIcon';
import BugIcon from '@/components/icons/bugIcon';

const Footer = () => {
  return (
    <footer className="bottom-0 flex flex-col items-center p-4 gap-1 justify-center text-sm">
      <div className="flex flex-row gap-2">
        <div className="flex items-center">
          <BrushesIcon alt="Dooduel logo" className="size-6 mr-1" />
          Dooduel &copy; by&nbsp;<Link href="https://github.com/ihtnc" className="underline" target="blank" rel="noopener noreferrer">ihtnc</Link>
        </div>
        <span className="scale-75 font-bold mt-0.5 text-[var(--primary)]">|</span>
        <Link href="https://github.com/ihtnc/dooduel" target="blank" rel="noopener noreferrer"
          className="flex flex-row items-center underline gap-1 group">
          <CodeIcon alt="Code" className="size-6 group-hover:scale-120 -ml-1" />
          Code
        </Link>
        <span className="scale-75 font-bold mt-0.5 text-[var(--primary)]">|</span>
        <Link href="https://github.com/ihtnc/dooduel/issues" target="blank" rel="noopener noreferrer"
          className="flex flex-row items-center underline gap-1 group">
          <BugIcon alt="Issues" className="size-6 group-hover:scale-120" />
          Bug?
        </Link>
      </div>
    </footer>
  );
};

export default Footer;