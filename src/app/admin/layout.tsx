import type { Metadata } from "next";

/** Prévia própria do admin ao compartilhar o link (WhatsApp etc.); o site público continua com a prévia normal. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  openGraph: {
    title: "Admin · E Você, O Que Acha?",
    description: "Área restrita do painel. Acesso com o código do Google Authenticator.",
  },
  twitter: { card: "summary_large_image", title: "Admin · E Você, O Que Acha?", description: "Área restrita do painel." },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
