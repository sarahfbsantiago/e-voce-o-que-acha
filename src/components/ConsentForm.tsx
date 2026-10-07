"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { RestartButton } from "@/components/RestartButton";
import { AGE_RANGES, REGIONS, type AgeRange, type Region } from "@/domain/types";
import { useSession } from "@/store/session";

export function ConsentForm() {
  const router = useRouter();
  const { session, hydrated, update } = useSession();
  // Aceite obrigatório (LGPD): a caixa começa desmarcada e o botão só libera depois do aceite.
  const [agreed, setAgreed] = useState(false);
  const [age, setAge] = useState<AgeRange | "">("");
  const [region, setRegion] = useState<Region | "">("");

  const hasProgress = session.answers.length > 0;

  function start() {
    if (!agreed) return;
    update({
      consent: "accepted",
      consentUpdatedAt: new Date().toISOString(),
      demographics: { ageRange: age || null, region: region || null },
    });
    router.push("/questionario/perguntas");
  }

  if (!hydrated) return null;

  return (
    <section className="animate-fade-up [animation-delay:200ms] mt-6 card p-6 md:p-8 space-y-5 shadow-sm border-t-4 border-t-purple" aria-labelledby="consent-title">
      <h2 id="consent-title" className="text-lg md:text-xl font-bold leading-snug">Ajude a pesquisa, sem contar quem você é</h2>


      <div className="rounded-xl border border-line bg-paper/60 p-4 space-y-3">
        <p className="text-sm font-medium">Dados opcionais <span className="font-normal text-ink-3">(categorias amplas, sem cidade ou CEP; não informar não impede nada)</span></p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm flex flex-col gap-1">Faixa etária
            <select className="field" value={age} onChange={(e) => setAge(e.target.value as AgeRange | "")}>
              <option value="">Não informar</option>
              {AGE_RANGES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </label>
          <label className="text-sm flex flex-col gap-1">Região do Brasil
            <select className="field" value={region} onChange={(e) => setRegion(e.target.value as Region | "")}>
              <option value="">Não informar</option>
              {REGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className={`rounded-xl border p-4 transition-colors ${agreed ? "border-accent bg-accent-soft" : "border-line-strong"}`}>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} required className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 accent-accent" />
          <span className="text-sm leading-relaxed">
            <span className="font-semibold">Concordo</span> e autorizo o uso anônimo dos dados, em nível de pesquisa, conforme a Lei Geral de Proteção de Dados (LGPD).
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button onClick={start} disabled={!agreed} className="min-h-10! px-5!">
          Concordar e continuar
          <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Button>
        {hasProgress ? <RestartButton variant="secondary" className="min-h-10! px-4! text-xs" /> : null}
      </div>
      {hasProgress ? <p className="text-xs text-ink-3">Você já tem respostas salvas: ao continuar, retoma de onde parou.</p> : null}
    </section>
  );
}
