import { Metadata } from "next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata: Metadata = {
  title: "New game - Dooduel",
  description: "Start a Dooduel and invite your friends to join!",
};