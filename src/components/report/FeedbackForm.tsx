"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { CURRENT_METHODOLOGY_VERSION } from "@/data/methodology";

/** Avaliação anônima da pesquisa: nota (1–5) e se ajudou na decisão. Enviada só ao clicar. */
export function FeedbackForm() {
  const [rating, setRating] = useState<number | null>(null);
  const [helped, setHelped] = useState<"yes" | "no" | "skip" | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "unavailable" | "error">("idle");

  async function submit() {
    if (!rating) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/survey/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ methodologyVersion: CURRENT_METHODOLOGY_VERSION, rating, helpedDecision: helped === "yes" ? true : helped === "no" ? false : null }),
      });
      setStatus(res.status === 503 ? "unavailable" : res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="card p-5 md:p-6 max-w-2xl" aria-labelledby="avaliacao">
      <h2 id="avaliacao" className="text-xl font-bold">Avalie esta pesquisa</h2>
      <p className="text-sm text-ink-2 mt-1">Avaliação anônima: não pedimos nome, email ou documento, e ela só é enviada se você clicar em Enviar.</p>

      <fieldset className="mt-4">
        <legend className="text-sm font-semibold">Que nota você dá para a pesquisa?</legend>
        <div className="mt-2 flex gap-2" role="radiogroup">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={`flex h-12 w-12 items-center justify-center rounded-lg border cursor-pointer font-semibold ${rating === n ? "border-accent bg-accent-soft" : "border-line hover:bg-paper"}`}>
              <input type="radio" name="rating" value={n} className="sr-only" checked={rating === n} onChange={() => setRating(n)} />
              {n}
            </label>
          ))}
        </div>
        <p className="text-xs text-ink-3 mt-1">1 = muito ruim · 5 = muito boa</p>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="text-sm font-semibold">A pesquisa auxiliou na sua decisão?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {[["yes", "Sim"], ["no", "Não"], ["skip", "Prefiro não dizer"]].map(([v, l]) => (
            <label key={v} className={`rounded-lg border px-4 py-2 cursor-pointer min-h-11 flex items-center ${helped === v ? "border-accent bg-accent-soft" : "border-line hover:bg-paper"}`}>
              <input type="radio" name="helped" value={v} className="sr-only" checked={helped === v} onChange={() => setHelped(v as "yes" | "no" | "skip")} />
              {l}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 flex items-center gap-3">
        <Button onClick={submit} disabled={!rating || status === "sending" || status === "sent"}>{status === "sent" ? "Enviado. Obrigado!" : "Enviar avaliação"}</Button>
        {status === "unavailable" ? <p className="text-sm text-ink-2" role="status">O envio está desativado neste ambiente (sem banco de dados). Sua avaliação não foi registrada.</p> : null}
        {status === "error" ? <p className="text-sm text-ink-2" role="status">Não foi possível enviar. Tente novamente.</p> : null}
      </div>
    </section>
  );
}
