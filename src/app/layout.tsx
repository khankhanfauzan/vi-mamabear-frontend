import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Quicksand } from "next/font/google";
import AuthProvider from "@/providers/AuthProvider";
import {CartInitializer} from "@/features/cart/components/CartInitializer.ts";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "MamaBear",
  description: "MamaBear, Segala kebaikan untuk Mama.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        geistSans.variable,
        geistMono.variable,
        quicksand.variable,
        "font-sans",
      )}
    >
      <body className={`${quicksand.variable} antialiased`}>
        <AuthProvider>
          <CartInitializer />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
