import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NESH® — Creative Webflow Developer",
  description:
    "Working closely with your team to deliver Webflow builds that merge creativity, technical excellence, and long-term value.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <body className="min-h-[100dvh]">
        <SmoothScroll>
          <CustomCursor />
          <Header />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
