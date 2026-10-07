"use client";

import { usePathname } from "next/navigation";
import { StartButton, showStartButton } from "@/components/StartButton";

/**
 * Faixa de chamada antes do rodapé, em todas as páginas: o botão Começar pulsando.
 * Fica de fora só da própria tela de perguntas, para não competir com Avançar.
 */
export function StartCta() {
  const pathname = usePathname();
  if (!showStartButton(pathname)) return null;
  const isHome = pathname === "/";
  return (
    <section aria-label="Começar o questionário" className="relative z-10 container-page pb-10 pt-4 sm:pb-16 sm:pt-6">
      <div className="card relative overflow-hidden p-6 text-center sm:p-8 md:p-10">
        <span aria-hidden="true" className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-purple-soft blur-3xl" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-mint-soft blur-3xl" />
        <p className="relative text-lg font-semibold tracking-tight md:text-xl">{isHome ? "Pronto para ver seu perfil?" : "Ainda não respondeu?"}</p>
        <p className="relative mt-1 text-sm text-ink-2">47 perguntas, sem nome de candidato, com as fontes no final. Você decide.</p>
        <div className="relative mt-6 flex justify-center">
          <StartButton className="btn-cta min-h-12 rounded-2xl px-8 text-base sm:min-h-14 sm:px-10 sm:text-lg" />
        </div>
      </div>
    </section>
  );
}
