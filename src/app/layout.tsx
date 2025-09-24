import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UserContextProvider } from "@/components/userContextProvider";
import Header from "@/components/header";
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
  title: "Dooduel",
  description: "Doodle fast. Guess faster!",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-5xl mx-auto`}
      >
        <UserContextProvider user={session}>
          <section className="flex flex-col min-h-screen gap-5">
            <Header />
            <div className="flex flex-grow mx-auto">
              {children}
            </div>
            <footer className="flex bottom-0 items-center justify-center">
              Footer
            </footer>
          </section>
        </UserContextProvider>
      </body>
    </html>
  );
}
