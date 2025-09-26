import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
