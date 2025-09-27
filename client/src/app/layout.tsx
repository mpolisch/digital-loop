import type { Metadata } from "next";
import { Press_Start_2P, IBM_Plex_Mono, VT323 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react"
import "@/styles/globals.css";

export const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const plexMono = IBM_Plex_Mono({
  weight: "400",
  subsets: ["latin"],
})

export const vt323 =VT323({
  weight: "400",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Digital Loop",
  description: "Learn your music.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${vt323.className} ${pressStart.variable}`}>
      <body>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />      </body>
    </html>
  );
}
