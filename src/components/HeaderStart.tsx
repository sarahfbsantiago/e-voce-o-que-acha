"use client";

import { usePathname } from "next/navigation";
import { StartButton, showStartButton } from "@/components/StartButton";

/** Botão "Começar" no cabeçalho de todas as páginas. */
export function HeaderStart() {
  const pathname = usePathname();
  if (!showStartButton(pathname)) return null;
  return <StartButton className="min-h-9! rounded-xl px-4! py-1.5! text-sm" />;
}
