import { type Metadata } from "next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export async function generateMetadata(
  { params }: { params: Promise<{ name: string }> }
): Promise<Metadata> {
  const { name } = await params;

  return {
    title: `Lobby: ${name} - Dooduel`,
    description: "Waiting for the fun to begin!",
  };
};
