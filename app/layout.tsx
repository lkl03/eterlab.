import type { Metadata } from "next";
import { Karla } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const titleFont = Karla({
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
  weight: ["500", "600", "700"],
});

const bodyFont = Karla({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "eterlab.",
  description: "Coming Soon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es"         className={[
          titleFont.variable,
          bodyFont.variable,
          "font-body min-h-dvh",
          "bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
          "transition-colors duration-200",
        ].join(" ")}>
      <body className="min-h-dvh bg-white text-zinc-900 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

