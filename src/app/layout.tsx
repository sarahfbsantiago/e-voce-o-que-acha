import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteOnly } from "@/components/SiteOnly";
import { LiveConfigProvider } from "@/components/LiveConfigProvider";
import { ensureLiveConfig } from "@/lib/live-config-server";
import { QUESTIONS } from "@/data/questions";
import { StartCta } from "@/components/StartCta";
import { BrazilScene } from "@/components/brand/BrazilScene";
import { PageGlow } from "@/components/fx/PageGlow";
import { RevealOnScroll } from "@/components/fx/RevealOnScroll";

/** Fonte do site: Verdana (fonte do sistema, definida em globals.css). Não há download de fonte externa. */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "http://localhost:3000");

export async function generateMetadata(): Promise<Metadata> {
  await ensureLiveConfig();
  const n = QUESTIONS.length;
  return {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "E Você, O Que Acha?",
    template: "%s · E Você, O Que Acha?",
  },
  description:
    "Descubra sua ideologia política e compare suas prioridades com propostas e registros públicos dos candidatos. Este site não diz em quem você deve votar.",
  applicationName: "E Você, O Que Acha?",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "E Você, O Que Acha?",
    title: "E Você, O Que Acha?",
    description: `Somente dados. Fontes oficiais disponíveis para consulta. Use com moderação. ${n} perguntas, sem nome de candidato, com as fontes no final.`,
  },
  twitter: { card: "summary_large_image", title: "E Você, O Que Acha?", description: "Somente dados. Fontes oficiais disponíveis para consulta. Use com moderação." },
  };
}

/** Toda página lê a configuração publicada no banco (perguntas, notas e régua editáveis no admin). */
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const live = await ensureLiveConfig();
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        <LiveConfigProvider cfg={live.cfg} cfgKey={live.key}>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-3 focus:py-2 focus:rounded"
        >
          Pular para o conteúdo
        </a>
        <SiteOnly><PageGlow /></SiteOnly>
        <SiteOnly><BrazilScene anchorId="mapa-anchor" size={220} spacing={3} dust={240} /></SiteOnly>
        <RevealOnScroll />
        <SiteOnly><SiteHeader /></SiteOnly>
        <main id="conteudo" className="relative z-10 flex-1">
          {children}
        </main>
        <SiteOnly><StartCta /></SiteOnly>
        <SiteOnly><SiteFooter /></SiteOnly>
        </LiveConfigProvider>
      </body>
    </html>
  );
}
