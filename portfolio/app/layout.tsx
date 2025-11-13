import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Momo_Trust_Display,
  Momo_Trust_Sans,
} from "next/font/google";
import "./globals.css";
import LenisProvider from "./lenis-provider";

const momo = Momo_Trust_Display({
  subsets: ["latin"],
  weight: ["400"],
});

const momoSans = Momo_Trust_Sans({
  subsets: ["latin"],
  weight: ["400"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Portfolio site",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={momoSans.className}>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
