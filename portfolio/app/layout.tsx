import type { Metadata } from "next";
import {
  Momo_Trust_Display,
  Momo_Trust_Sans,
} from "next/font/google";
import "./globals.css";
import LenisProvider from "./lenis-provider";
import TransitionWrapper from "./transitionwrapper";
import Header from "./header";
import { AnimatePresence } from "framer-motion";

const momoSans = Momo_Trust_Sans({
  subsets: ["latin"],
  weight: ["400"],
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
        <LenisProvider>
          <Header />
          <TransitionWrapper>
            {children}
          </TransitionWrapper>
        </LenisProvider>
      </body>
    </html>
  );
}
