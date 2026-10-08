import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StartCta } from "@/components/StartCta";
import { BrazilScene } from "@/components/brand/BrazilScene";
import { PageGlow } from "@/components/fx/PageGlow";
import { RevealOnScroll } from "@/components/fx/RevealOnScroll";

/** Fonte do site: Verdana (fonte do sistema, definida em globals.css). Não há download de fonte externa. */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Menos Pior",
    template: "%s · Menos Pior",
  },
  description:
    "Compare suas prioridades com propostas e registros públicos dos candidatos. Este site não diz em quem você deve votar.",
  applicationName: "Menos Pior",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Menos Pior",
    title: "Menos Pior",
    description: "Somente dados. Fontes oficiais disponíveis para consulta. Use com moderação. 25 perguntas, sem nome de candidato, com as fontes no final.",
  },
  twitter: { card: "summary_large_image", title: "Menos Pior", description: "Somente dados. Fontes oficiais disponíveis para consulta. Use com moderação." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
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
