import { Metadata } from "next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata: Metadata = {
  title: "Join game - Dooduel",
  description: "Join in on the fun!",
};