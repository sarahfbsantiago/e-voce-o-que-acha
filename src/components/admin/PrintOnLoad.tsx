"use client";

import { useEffect } from "react";

/** Abre a janela de impressão (Salvar como PDF) assim que a página termina de carregar. */
export function PrintOnLoad({ fileTitle }: { fileTitle: string }) {
  useEffect(() => {
    const prev = document.title;
    document.title = `E Você, O Que Acha? · ${fileTitle} · ${new Date().toLocaleDateString("pt-BR").replaceAll("/", "-")}`;
    const id = window.setTimeout(() => window.print(), 900);
    return () => { window.clearTimeout(id); document.title = prev; };
  }, [fileTitle]);
  return null;
}
