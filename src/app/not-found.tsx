"use client";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">That doesn&apos;t seem to exist</h1>
      <Link href="/">
        <button className="px-8 py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold shadow hover:bg-blue-700 transition">Home</button>
      </Link>
    </div>
  );
}
