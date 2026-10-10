"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui";
import { CURRENT_METHODOLOGY_VERSION } from "@/data/methodology";
import { useSession } from "@/store/session";

/** Lembra no navegador se a pessoa já avaliou e se o pop-up da régua já apareceu (ele aparece uma vez só). */
const DONE_KEY = "voce-decide:avaliacao:v1";
const RULER_KEY = "voce-decide:avaliacao-regua:v1";
const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* sem armazenamento: o pop-up pode voltar */ } };
const sent = () => read(DONE_KEY) === "sent";

const noopSubscribe = () => () => undefined;

type Helped = "yes" | "no";
type Status = "idle" | "sending" | "sent" | "unavailable" | "error";

/** Nota e "ajudou?" (as duas obrigatórias). Usado na caixa do fim do relatório e no pop-up, com o mesmo estado. */
function FeedbackFields({ id, rating, setRating, helped, setHelped, status, submit }: { id: string; rating: number | null; setRating: (n: number) => void; helped: Helped | null; setHelped: (h: Helped) => void; status: Status; submit: () => void }) {
  return (
    <>
      <fieldset className="mt-4">
        <legend className="text-sm font-semibold">Que nota você dá para a pesquisa?</legend>
        <div className="mt-2 flex gap-2" role="radiogroup">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={`flex h-12 w-12 items-center justify-center rounded-lg border cursor-pointer font-semibold ${rating === n ? "border-accent bg-accent-soft" : "border-line hover:bg-paper"}`}>
              <input type="radio" name={`${id}-rating`} value={n} className="sr-only" checked={rating === n} onChange={() => setRating(n)} />
              {n}
            </label>
          ))}
        </div>
        <p className="text-xs text-ink-3 mt-1">1 = muito ruim · 5 = muito boa</p>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="text-sm font-semibold">A pesquisa auxiliou na sua decisão?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {([["yes", "Sim"], ["no", "Não"]] as const).map(([v, l]) => (
            <label key={v} className={`rounded-lg border px-4 py-2 cursor-pointer min-h-11 flex items-center ${helped === v ? "border-accent bg-accent-soft" : "border-line hover:bg-paper"}`}>
              <input type="radio" name={`${id}-helped`} value={v} className="sr-only" checked={helped === v} onChange={() => setHelped(v)} />
              {l}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 flex items-center gap-3">
        <Button onClick={submit} disabled={!rating || !helped || status === "sending" || status === "sent"}>{status === "sent" ? "Enviado. Obrigado!" : "Enviar avaliação"}</Button>
        {status === "unavailable" ? <p className="text-sm text-ink-2" role="status">O envio está desativado neste ambiente (sem banco de dados). Sua avaliação não foi registrada.</p> : null}
        {status === "error" ? <p className="text-sm text-ink-2" role="status">Não foi possível enviar. Tente novamente.</p> : null}
      </div>
    </>
  );
}

/**
 * Avaliação anônima da pesquisa: nota (1–5) e se ajudou na decisão (Sim/Não). Enviada só ao clicar e só com o consentimento aceito.
 * Além da caixa no fim do relatório, um pop-up aparece uma vez quando a régua do espectro surge na tela.
 */
export function FeedbackForm() {
  const { session } = useSession();
  const consented = session.consent === "accepted";
  const [rating, setRating] = useState<number | null>(null);
  const [helped, setHelped] = useState<Helped | null>(null);
  const [sendStatus, setStatus] = useState<Status>("idle");
  const dialogRef = useRef<HTMLDialogElement>(null);
  // já avaliou antes (neste navegador): a caixa aparece como enviada
  const sentBefore = useSyncExternalStore(noopSubscribe, sent, () => false);
  const status: Status = sentBefore ? "sent" : sendStatus;

  const open = () => { if (!dialogRef.current?.open) dialogRef.current?.showModal(); };

  // pop-up quando a pessoa chega na régua do espectro (a régua avisa): uma vez só, se ainda não avaliou
  useEffect(() => {
    if (!consented) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onRuler = () => {
      if (sent() || read(RULER_KEY) || timer) return;
      // um instante para a pessoa ver a régua antes do pop-up
      timer = setTimeout(() => {
        if (sent() || read(RULER_KEY)) return;
        write(RULER_KEY, "1");
        open();
      }, 2500);
    };
    window.addEventListener("avaliacao:regua", onRuler);
    return () => { window.removeEventListener("avaliacao:regua", onRuler); clearTimeout(timer); };
  }, [consented]);

  async function submit() {
    if (!rating || !helped || !consented) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/survey/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ methodologyVersion: CURRENT_METHODOLOGY_VERSION, rating, helpedDecision: helped === "yes" }),
      });
      const next: Status = res.status === 503 ? "unavailable" : res.ok ? "sent" : "error";
      setStatus(next);
      if (next === "sent") {
        write(DONE_KEY, "sent");
        setTimeout(() => dialogRef.current?.close(), 1200);
      }
    } catch {
      setStatus("error");
    }
  }

  const fields = { rating, setRating, helped, setHelped, status, submit };
  return (
    <>
      <section className="card p-5 md:p-6 max-w-2xl" aria-labelledby="avaliacao">
        <h2 id="avaliacao" className="text-xl font-bold">Avalie esta pesquisa</h2>
        <p className="text-sm text-ink-2 mt-1">Avaliação anônima, compartilhada só em nível de pesquisa: não pedimos nome, email ou documento, e ela só é enviada se você clicar em Enviar.</p>
        <FeedbackFields id="caixa" {...fields} />
      </section>

      <dialog ref={dialogRef} className="modal" aria-labelledby="avaliacao-popup" onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current?.close(); }}>
        <div className="modal-panel">
          <header className="flex items-center gap-3 border-b border-line px-5 py-4">
            <h2 id="avaliacao-popup" className="min-w-0 flex-1 text-base font-bold">Avalie esta pesquisa</h2>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Fechar" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink-2 hover:bg-paper"><span aria-hidden="true" className="text-xl leading-none">×</span></button>
          </header>
          <div className="modal-body px-5 pb-5">
            <FeedbackFields id="popup" {...fields} />
          </div>
        </div>
      </dialog>
    </>
  );
}
