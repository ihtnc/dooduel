"use client";

import React from 'react';
import Link from 'next/link';
import HomeButton from './button/homeButton';
import Avatar from '@/components/avatar';
import { getUserContext } from '@/components/userContextProvider';
import { cn } from '@utilities/index';

const Header = () => {
  const user = getUserContext();

  return (
    <header className="top-0 flex items-center p-4 gap-5 justify-between">
      <Link href="/">
        <HomeButton />
      </Link>
      <Link href="/player"className={cn("border-4", "border-[#715A5A]", "rounded",
        "hover:border-[#44444E]", "hover:bg-[#715A5A]",
        "dark:hover:bg-[#44444E]",
      )}>
        <Avatar code={user?.avatar} alt="Player Profile" className="group-hover:scale-110" />
      </Link>
    </header>
  );
};

export default Header;