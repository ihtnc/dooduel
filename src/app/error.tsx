"use client";

import Link from "next/link";
import HomeButton from "@/components/button/homeButton";
import BrokenBrushIcon from "@/components/icons/brokenBrushIcon";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <BrokenBrushIcon alt="Error" className="scale-150 mb-8" />
      <h1 className="mb-4 font-subheading">That shouldn&apos;t happen</h1>
      <Link href="/">
        <HomeButton imageAlt="Home" className="w-50">
          Home
        </HomeButton>
      </Link>
    </div>
  );
}
