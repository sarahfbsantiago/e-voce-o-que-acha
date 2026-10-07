"use client";

import { Button } from "@/components/ui";

/** Abre a impressão do navegador, onde a pessoa escolhe "Salvar como PDF". Sem dependência externa. */
export function PrintButton({ label = "Baixar em PDF", className = "", fileTitle = "Meu relatório" }: { label?: string; className?: string; fileTitle?: string }) {
  return (
    <Button type="button" variant="secondary" className={`print:hidden ${className}`} onClick={() => {
      const prev = document.title;
      document.title = `Menos Pior · ${fileTitle} · ${new Date().toLocaleDateString("pt-BR").replaceAll("/", "-")}`;
      window.print();
      setTimeout(() => { document.title = prev; }, 500);
    }}>
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5M4 14v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </Button>
  );
}
