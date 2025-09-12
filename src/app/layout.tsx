import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UserContextProvider } from "@/components/userContextProvider";
import { getSession } from "@utilities/session";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dooduel",
  description: "Sketch fast. Guess faster.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserContextProvider user={session}>
          {children}
        </UserContextProvider>
      </body>
    </html>
  );
}
