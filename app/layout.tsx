import type { Metadata, Viewport } from "next";
import { Chivo, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

// Las mismas fuentes que la app mobile: Chivo para títulos, Hanken Grotesk para el resto.
const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/**
 * Defaults de metadata para todo el sitio (GRI-22). Cada página pone su
 * `title` corto y su canónica; el sufijo lo agrega el template.
 * `metadataBase` es lo que permite que las canónicas y las OG sean relativas.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "GRIDD — Encuentros fierreros de Uruguay",
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
    // `suppressHydrationWarning` porque el script inline de la landing agrega
    // `.js-anim` al <html> mientras el browser parsea, antes de que React
    // hidrate. Sin esto React ve el `class` cambiado y tira mismatch.
    <html
      lang={site.locale}
      className={cn("dark h-full antialiased", chivo.variable, hanken.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
