import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Suspense fallback={null}>{children}</Suspense>
      <Analytics />
      <Footer />
      </>
  );
}