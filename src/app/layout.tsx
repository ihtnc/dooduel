import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UserContextProvider } from "@/components/userContextProvider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getSession } from "@utilities/session";
import { PrimaryFont } from "@fonts";
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
        className={`${geistSans.variable} ${geistMono.variable} ${PrimaryFont.variable} antialiased max-w-5xl mx-auto`}
      >
        <UserContextProvider user={session}>
          <section className="flex flex-col h-screen min-h-170 gap-5">
            <Header />
            <div className="flex flex-grow mx-auto">
              {children}
            </div>
            <Footer />
          </section>
        </UserContextProvider>
      </body>
    </html>
  );
}
