"use client";

import Link from "next/link";
import HomeButton from "@/components/button/homeButton";
import MissingBrushIcon from "@/components/icons/missingBrushIcon";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <MissingBrushIcon alt="Not found" className="scale-150 mb-8" />
      <h2 className="mb-4 font-subheading">That doesn&apos;t seem to exist</h2>
      <Link href="/">
        <HomeButton imageAlt="Home" className="w-50">
          Home
        </HomeButton>
      </Link>
    </div>
  );
}
