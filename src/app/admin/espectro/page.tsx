import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageTitle } from "@/components/ui";
import { isAdminSession } from "@/lib/admin-auth";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { AREA_GROUPS } from "@/components/report/areaGroups";
import { QUESTION_NUMBER } from "@/lib/question-order";
import { spectrumPositionOf } from "@/data/spectrum-positions";
import { IDEOLOGY_RANGES, SPECTRUM_BANDS, bandAt } from "@/data/political-spectrum";
import { logoutAction } from "../login/actions";
import { AdminNav } from "@/components/AdminNav";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = { title: "Espectro político", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const fmt = (n: number) => (n > 0 ? `+${n}` : `${n}`).replace(".", ",");
const SIDE = (n: number) => (n < 0 ? "esquerda" : n > 0 ? "direita" : "centro");
/** Cor da faixa onde a alternativa sozinha levaria a pessoa (mesma conta da régua: 4 + posição × 1,25). */
const bandColor = (n: number) => SPECTRUM_BANDS[Math.min(SPECTRUM_BANDS.length - 1, Math.floor(4 + n * 1.25))].color;

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
            <thead><tr className="text-left text-xs text-ink-3"><th className="p-2">Alternativa que a pessoa marca</th><th className="w-28 p-2">Posição</th><th className="p-2">Na régua</th></tr></thead>
            <tbody>
              {q.options.filter((o) => !o.isNoOpinion).map((o) => {
                const v = spectrumPositionOf(q.id, o.id);
                if (v) { cells++; if (v.reason !== "Proposta") reviewed++; }
                return (
                  <tr key={o.id} className="border-t border-line align-top">
                    <th scope="row" className="p-2 text-left font-medium">{o.label}</th>
                    {v ? (
                      <>
                        <td className={`p-2 font-semibold tabular-nums ${v.reason !== "Proposta" ? "outline-2 -outline-offset-2 outline-purple" : ""}`} title={v.reason}>{fmt(v.position)}</td>
                        <td className="p-2">
                          <span className="inline-flex items-center gap-2 text-xs">
                            <span aria-hidden="true" className="relative inline-block h-2 w-24 rounded-full bg-line">
                              <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface" style={{ left: `${((v.position + 2) / 4) * 100}%`, background: bandColor(v.position) }} />
                            </span>
                            {SIDE(v.position)} · {bandAt(4 + v.position * 1.25)}
                          </span>
                        </td>
                      </>
                    ) : <td colSpan={2} className="p-2 italic text-ink-3">sem posição (não entra na régua)</td>}
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
        <PageTitle eyebrow="Admin" tone="gold" lead="Onde cada alternativa coloca a pessoa na régua do espectro político do relatório. Não depende dos candidatos. Mudou aqui, mudou na régua.">
          Espectro político
        </PageTitle>
        <div className="flex flex-wrap items-center gap-2 print:hidden"><PrintButton label="Exportar PDF" fileTitle="Espectro político" /><form action={logoutAction}><button className="rounded-lg border border-line px-3 py-2 text-sm min-h-11">Sair</button></form></div>
      </div>
      <div className="card p-4 text-sm space-y-2">
        <p>Posição de −2 (esquerda) a +2 (direita); 0 é centro. &quot;Não sei&quot; nunca entra.</p>
        <p>Posição da pessoa = média das posições das alternativas que ela marcou. Na régua: 4 + média × 1,25, de 1,5 (esquerda) a 6,5 (direita radical). As 25 perguntas não medem os extremos, por isso a pessoa nunca cai em comunismo ou fascismo.</p>
        <p>Ideologia mostrada: {IDEOLOGY_RANGES.map((r, i) => `${r.label} ${i === 0 ? `até ${String(r.upTo).replace(".", ",")}` : r.upTo === Infinity ? `acima de ${String(IDEOLOGY_RANGES[i - 1].upTo).replace(".", ",")}` : `até ${String(r.upTo).replace(".", ",")}`}`).join(" · ")}.</p>
        <p>O resultado por tema (Lula, Flávio ou equivalente) continua vindo da tabela Notas por alternativa.</p>
        <p className="font-semibold">{reviewed === 0 ? `Todas as ${cells} posições são a proposta inicial, aguardando sua revisão.` : `${reviewed} das ${cells} posições já foram revisadas por você (borda roxa).`}</p>
      </div>
      {body}
    </div>
  );
}
