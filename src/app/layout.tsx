import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StartCta } from "@/components/StartCta";
import { BrazilScene } from "@/components/brand/BrazilScene";
import { PageGlow } from "@/components/fx/PageGlow";
import { RevealOnScroll } from "@/components/fx/RevealOnScroll";

/** Fonte do site: Roboto Mono (estilo código), com fallback monoespaçado do sistema. */
const robotoMono = Roboto_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Você decide",
    template: "%s · Você decide",
  },
  description:
    "Compare suas prioridades com propostas e registros públicos dos candidatos. Este site não diz em quem você deve votar.",
  applicationName: "Você decide",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Você decide",
    title: "Você decide",
    description: "Nós organizamos as evidências. Vote com consciência. 52 perguntas, sem nome de candidato, com as fontes no final.",
  },
  twitter: { card: "summary_large_image", title: "Você decide", description: "Nós organizamos as evidências. Vote com consciência." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={robotoMono.variable}>
      <body className="min-h-screen flex flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-3 focus:py-2 focus:rounded"
        >
          Pular para o conteúdo
        </a>
        <PageGlow />
        <BrazilScene anchorId="mapa-anchor" size={220} spacing={3} dust={240} />
        <RevealOnScroll />
        <SiteHeader />
        <main id="conteudo" className="relative z-10 flex-1">
          {children}
        </main>
        <StartCta />
        <SiteFooter />
      </body>
    </html>
  );
}
