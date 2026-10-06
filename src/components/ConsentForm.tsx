"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { RestartButton } from "@/components/RestartButton";
import { AGE_RANGES, REGIONS, type AgeRange, type Region } from "@/domain/types";
import { useSession } from "@/store/session";

const BENEFITS: [string, string][] = [
  ["Anônimo de verdade", "Sem nome, email, documento, IP ou cidade. Não existe campo para isso."],
  ["Só estatísticas", "Suas respostas viram números agregados: quais temas importam mais e como as opiniões se dividem."],
  ["Você manda", "Dá para mudar de ideia a qualquer momento em Privacidade e dados."],
];

export function ConsentForm() {
  const router = useRouter();
  const { session, hydrated, update } = useSession();
  // "Sim" vem sempre marcado ao abrir a tela, mesmo que a pessoa tenha recusado antes; "Não" fica a um toque.
  // O consentimento gravado só muda quando a pessoa clica em continuar.
  const [choice, setChoice] = useState<"accepted" | "declined" | null>(null);
  const [age, setAge] = useState<AgeRange | "">("");
  const [region, setRegion] = useState<Region | "">("");

  const effective = choice ?? "accepted";
  const hasProgress = session.answers.length > 0;

  function start() {
    update({
      consent: effective,
      consentUpdatedAt: new Date().toISOString(),
      demographics: effective === "accepted" ? { ageRange: age || null, region: region || null } : { ageRange: null, region: null },
    });
    router.push("/questionario/perguntas");
  }

  if (!hydrated) return null;

  return (
    <section className="animate-fade-up [animation-delay:200ms] mt-6 card p-6 md:p-8 space-y-5 shadow-sm border-t-4 border-t-purple" aria-labelledby="consent-title">
      <h2 id="consent-title" className="text-lg md:text-xl font-bold leading-snug">Ajude a pesquisa, sem contar quem você é</h2>

      <ul className="grid gap-3 sm:grid-cols-3 text-sm">
        {BENEFITS.map(([t, d], i) => (
          <li key={t} className="rounded-xl border border-line bg-paper/60 p-4">
            <p className="font-semibold flex items-center gap-2">
              <span aria-hidden="true" className={`h-2 w-2 rounded-full ${["bg-purple", "bg-mint", "bg-gold"][i]}`} />
              {t}
            </p>
            <p className="mt-1 text-xs text-ink-2 leading-relaxed">{d}</p>
          </li>
        ))}
      </ul>

      <fieldset className="grid gap-3 pt-1 sm:grid-cols-2">
        <legend className="sr-only">Consentimento</legend>
        {[
          ["accepted", "Sim, contribuir anonimamente", "Recomendado"],
          ["declined", "Não, responder sem enviar", ""],
        ].map(([v, label, tag]) => (
          <label key={v} className={`relative flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border p-4 pr-5 transition-colors ${effective === v ? "border-accent bg-accent-soft" : "border-line hover:border-line-strong hover:bg-paper"}`}>
            <input type="radio" name="consent" value={v} checked={effective === v} onChange={() => setChoice(v as "accepted" | "declined")} className="h-[1.125rem] w-[1.125rem] shrink-0 accent-accent" />
            <span className="text-sm font-medium leading-snug">{label}</span>
            {tag ? <span className="absolute -top-2 right-3 whitespace-nowrap rounded-full border border-mint/40 bg-mint-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-mint-strong">{tag}</span> : null}
          </label>
        ))}
      </fieldset>

      {effective === "accepted" ? (
        <div className="rounded-xl border border-line bg-paper/60 p-4 space-y-3">
          <p className="text-sm font-medium">Dados opcionais <span className="font-normal text-ink-3">(categorias amplas, sem cidade ou CEP)</span></p>
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
      ) : null}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button onClick={start} className="min-h-10! px-5!">
          {effective === "accepted" ? "Concordar e continuar" : "Continuar sem enviar"}
          <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Button>
        {hasProgress ? <RestartButton variant="secondary" className="min-h-10! px-4! text-xs" /> : null}
        <a href="/privacidade" className="ml-auto text-xs text-ink-2 underline underline-offset-4 hover:text-purple-strong">Privacidade e dados</a>
      </div>
      {hasProgress ? <p className="text-xs text-ink-3">Você já tem respostas salvas: ao continuar, retoma de onde parou.</p> : null}
    </section>
  );
}
