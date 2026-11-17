import type { Metadata, Viewport } from "next";
import { Chivo, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { InlineScript } from "@/components/inline-script";
import { INTRO_SCRIPT } from "@/components/landing/intro-script";
import { THEME_CANVAS, THEME_SCRIPT } from "@/lib/theme";
import { AdsProvider } from "@/components/ads";
import { adsConfigFromEnv } from "@/lib/ads";

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
  // Agregada a la pantalla de inicio del iPhone abre sin la barra de Safari, como una app.
  appleWebApp: {
    capable: true,
    title: site.name,
    statusBarStyle: "default",
  },
  // Next sólo emite `mobile-web-app-capable`; iOS anteriores al 17 leen el de Apple.
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  // El orden importa: `applyPreference` (lib/theme.ts) asume claro primero y oscuro después.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_CANVAS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_CANVAS.dark },
  ],
  // Contenido hasta los bordes del iPhone; la barra de pestañas respeta la zona segura.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const ads = adsConfigFromEnv();
  return (
    // `suppressHydrationWarning` porque los scripts inline (tema y landing) tocan el <html> mientras
    // el browser parsea, antes de que React hidrate: `data-theme` y `.js-anim`. Sin esto React ve
    // los atributos cambiados y tira mismatch.
    <html
      lang={site.locale}
      className={cn("h-full antialiased", chivo.variable, hanken.variable)}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={THEME_SCRIPT} />
        <InlineScript html={INTRO_SCRIPT} />
        {/* AdSense: va siempre (con él Google verifica el sitio); los anuncios salen sólo donde hay
            una unidad configurada (components/ads.tsx). Dejar los "anuncios automáticos" apagados en
            AdSense, así no aparecen en otros lugares. */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads.client}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AdsProvider config={ads}>{children}</AdsProvider>
      </body>
    </html>
  );
}
