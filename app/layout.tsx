import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Defaults de metadata para todo el sitio (GRI-22). Cada página pone su
 * `title` corto y su canónica; el sufijo lo agrega el template.
 * `metadataBase` es lo que permite que las canónicas y las OG sean relativas.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "GRIDD — Próximamente",
    template: `%s · ${site.name.toUpperCase()}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    siteName: site.name.toUpperCase(),
    locale: site.locale.replace("-", "_"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.locale}
      className={cn("dark h-full antialiased", geistSans.variable, geistMono.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
