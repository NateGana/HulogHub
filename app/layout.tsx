import type { Metadata } from "next";
import { Inter, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppDataProvider } from "@/context/AppDataContext";
import { ToastProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/Toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "HulogHub — Save together. Grow together.",
  description:
    "HulogHub is a blockchain-powered Paluwagan savings platform built on the Stellar Network. Create groups, track contributions, and manage payouts transparently.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} ${mono.variable} font-sans`}>
        <AppDataProvider>
          <ThemeProvider>
            <ToastProvider>
              {children}
              <Toaster />
            </ToastProvider>
          </ThemeProvider>
        </AppDataProvider>
      </body>
    </html>
  );
}
