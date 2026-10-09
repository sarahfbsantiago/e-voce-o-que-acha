import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageTitle } from "@/components/ui";
import { isAdminSession } from "@/lib/admin-auth";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { AREA_GROUPS } from "@/components/report/areaGroups";
import { QUESTION_NUMBER } from "@/lib/question-order";
import { spectrumPositionOf } from "@/data/spectrum-positions";
import { IDEOLOGY_RANGES, SPECTRUM_BANDS } from "@/data/political-spectrum";
import { logoutAction } from "../login/actions";
import { AdminNav } from "@/components/AdminNav";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = { title: "Espectro político", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const bandIndex = (label: string) => SPECTRUM_BANDS.findIndex((b) => b.label === label);

export default async function AdminSpectrumPage() {
  if (!(await isAdminSession())) redirect("/admin/login");
  let reviewed = 0, cells = 0;

  const sections = AREA_GROUPS.map((g, gi) => {
    const topics = TOPICS.filter((t) => g.topicIds.includes(t.id)).sort((a, b) => a.order - b.order);
    const questions = topics.flatMap((t) => QUESTIONS.filter((q) => q.topicId === t.id).sort((a, b) => a.order - b.order).map((q) => ({ q, t })));
    return { g, gi, questions };
  });

  const body = sections.map(({ g, gi, questions }) => (
    <section key={g.id} className="space-y-3">
      <h2 className="flex items-center gap-2 border-l-4 pl-3 text-xl font-bold" style={{ borderColor: g.color }}>
        <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: g.color }} />Seção {gi + 1}: {g.label}
      </h2>
      {questions.map(({ q, t }) => (
        <div key={q.id} className="card p-4">
          <p className="font-semibold"><span className="mr-1 text-xs text-ink-3" title={`código interno ${q.id}`}>Pergunta {QUESTION_NUMBER[q.id]}</span>{q.text}</p>
          <p className="text-xs text-ink-3">{t.name}</p>
          <table className="mt-3 w-full text-sm">
            <thead><tr className="text-left text-xs text-ink-3"><th className="p-2">Alternativa que a pessoa marca</th><th className="p-2">Faixa da régua</th></tr></thead>
            <tbody>
              {q.options.filter((o) => !o.isNoOpinion).map((o) => {
                const v = spectrumPositionOf(q.id, o.id);
                if (v) { cells++; if (v.reason !== "Proposta") reviewed++; }
                return (
                  <tr key={o.id} className="border-t border-line align-top">
                    <th scope="row" className="p-2 text-left font-medium">{o.label}</th>
                    {v ? (
                      <td className={`p-2 ${v.reason !== "Proposta" ? "outline-2 -outline-offset-2 outline-purple" : ""}`} title={v.reason}>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold">
                          <span aria-hidden="true" className="flex h-2 w-32 overflow-hidden rounded-full">
                            {SPECTRUM_BANDS.map((b, i) => <span key={b.label} className="h-full flex-1" style={{ background: i === bandIndex(v.band) ? b.color : "var(--color-line)" }} />)}
                          </span>
                          <span className="rounded-md px-1.5 py-0.5" style={{ background: `${SPECTRUM_BANDS[bandIndex(v.band)].color}26` }}>{v.band}</span>
                        </span>
                      </td>
                    ) : <td className="p-2 italic text-ink-3">sem faixa (não entra na régua)</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  ));

  return (
    <div className="container-page py-12 space-y-8">
      <AdminNav current="/admin/espectro" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle eyebrow="Admin" tone="gold" lead="Para qual faixa da régua cada alternativa leva a pessoa do espectro político do relatório. Não depende dos candidatos. Mudou aqui, mudou na régua.">
          Espectro político
        </PageTitle>
        <div className="flex flex-wrap items-center gap-2 print:hidden"><PrintButton label="Exportar PDF" fileTitle="Espectro político" /><form action={logoutAction}><button className="rounded-lg border border-line px-3 py-2 text-sm min-h-11">Sair</button></form></div>
      </div>
      <div className="card p-4 text-sm space-y-2">
        <p>Cada alternativa aponta para uma faixa da régua. &quot;Não sei&quot; nunca entra.</p>
        <p>Posição da pessoa = média do meio das faixas das alternativas que ela marcou (Extrema esquerda 0,5 · Esquerda 1,5 · Centro-esquerda 2,5 · Centro 3,5 · Centro-direita 4,5 · Direita 5,5 · Direita radical 6,5 · Extrema direita 7,5).</p>
        <p>Ideologia mostrada: {IDEOLOGY_RANGES.map((r, i) => `${r.label} ${i === 0 ? `até ${String(r.upTo).replace(".", ",")}` : r.upTo === Infinity ? `acima de ${String(IDEOLOGY_RANGES[i - 1].upTo).replace(".", ",")}` : `até ${String(r.upTo).replace(".", ",")}`}`).join(" · ")}.</p>
        <p>O resultado por tema (Lula, Flávio ou equivalente) continua vindo da tabela Notas por alternativa.</p>
        <p className="font-semibold">{reviewed === 0 ? `Todas as ${cells} faixas são a proposta inicial, aguardando sua revisão.` : `${reviewed} das ${cells} faixas já foram revisadas por você (borda roxa); as demais são proposta.`}</p>
      </div>
      {body}
    </div>
  );
}
