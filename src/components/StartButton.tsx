"use client";

import type { MouseEvent, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui";

/** Endereço do início do questionário (tela de aceite antes das perguntas). */
export const START_HREF = "/questionario";

/**
 * Botão "Começar" único do site: sempre leva ao início do questionário, no topo.
 * Na própria tela de início, um link para a mesma página não faria nada; então sobe até o topo.
 */
export function StartButton({ className = "", children }: { className?: string; children?: ReactNode }) {
  const pathname = usePathname();
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (pathname === START_HREF) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  return (
    <ButtonLink href={START_HREF} scroll onClick={onClick} className={className}>
      {children ?? (
        <>
          Começar
          <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </>
      )}
    </ButtonLink>
  );
}

/** Esconde o botão onde ele atrapalha: durante as perguntas e no painel de administração. */
export function showStartButton(pathname: string): boolean {
  return !pathname.startsWith("/questionario/perguntas") && !pathname.startsWith("/admin");
}
