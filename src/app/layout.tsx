import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { getCurrentUser } from "@/lib/auth";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Klinika Vita | Rezervim terminesh",
  description:
    "Rezervoni termin te mjeku juaj në Klinika Vita — kardiologji, pediatri, ortopedi dhe më shumë.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="sq">
      <body className={`${dmSans.variable} ${fraunces.variable} antialiased min-h-screen`}>
        <SiteHeader user={user} />
        <main className="min-h-[70vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
