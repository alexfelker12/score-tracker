import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/footer";
import QueryProvider from "@/components/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BW Score Tracker",
  description: "Score tracker for different kind of games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased grid grid-rows-[auto_1fr_auto]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>

          {/* header */}
          <Header />

          {/* main content */}
          <div className="[&_>_main]:max-w-4xl [&_>_main]:p-4 [&_>_main]:w-full flex justify-center">
            {children}
          </div>

          {/* bottom/footer content */}
          <Footer />

          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
