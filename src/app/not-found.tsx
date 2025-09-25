"use client";

import Link from "next/link";
import HomeButton from "./components/button/homeButton";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">That doesn&apos;t seem to exist</h1>
      <Link href="/">
        <HomeButton imageAlt="Home" className="w-50">
          Home
        </HomeButton>
      </Link>
    </div>
  );
}
