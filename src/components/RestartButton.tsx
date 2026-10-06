"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { restartAnswers, useSession } from "@/store/session";

/**
 * "Começar do zero": apaga respostas e prioridades deste navegador (mantém o consentimento)
 * e leva à primeira pergunta. Pede confirmação em linha, sem diálogo do navegador.
 */
export function RestartButton({ label = "Começar do zero", variant = "ghost", className = "" }: { label?: string; variant?: "ghost" | "secondary"; className?: string }) {
  const router = useRouter();
  const { session, hydrated, update } = useSession();
  const [confirming, setConfirming] = useState(false);
  if (!hydrated || (session.answers.length === 0 && session.priorities.length === 0)) return null;

  if (!confirming) {
    return <Button type="button" variant={variant} className={className} onClick={() => setConfirming(true)}>{label}</Button>;
  }
  return (
    <span className={`inline-flex flex-wrap items-center gap-2 rounded-xl border border-gold/40 bg-gold-soft px-3 py-2 text-sm ${className}`} role="group" aria-label="Confirmar recomeço">
      <span className="text-ink-2">Apagar suas {session.answers.length} respostas e recomeçar?</span>
      <Button
        type="button"
        className="min-h-9 px-3 py-1.5"
        onClick={() => {
          update(restartAnswers());
          setConfirming(false);
          router.push("/questionario/perguntas");
        }}
      >
        Sim, recomeçar
      </Button>
      <Button type="button" variant="secondary" className="min-h-9 px-3 py-1.5" onClick={() => setConfirming(false)}>Não</Button>
    </span>
  );
}
