import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageTitle } from "@/components/ui";
import { isAdminSession } from "@/lib/admin-auth";
import { getContentRepository } from "@/lib/repository";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { AREA_GROUPS } from "@/components/report/areaGroups";
import { currentOptionScore, proposedOptionScore } from "@/lib/option-scores";
import { QUESTION_NUMBER } from "@/lib/question-order";
import { logoutAction } from "../login/actions";
import { AdminNav } from "@/components/AdminNav";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = { title: "Notas por alternativa", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const CANDS = [{ id: "lula", name: "Lula" }, { id: "flavio-bolsonaro", name: "Flávio" }];
const fmt = (n: number) => (n === 1 ? "1" : n === 0.5 ? "0,5" : "0");
const tone = (n: number) => (n === 1 ? "bg-mint-soft font-semibold" : n === 0.5 ? "bg-gold-soft" : "text-ink-3");

export default async function AdminScoresPage() {
  if (!(await isAdminSession())) redirect("/admin/login");
  const positions = await (await getContentRepository()).getPublishedPositions();
  let changed = 0, cells = 0;

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
            <thead><tr className="text-left text-xs text-ink-3"><th className="p-2">Alternativa que a pessoa marca</th>{CANDS.map((c) => <th key={c.id} className="w-1/4 p-2">{c.name} ganha</th>)}</tr></thead>
            <tbody>
              {q.options.filter((o) => !o.isNoOpinion).map((o) => (
                <tr key={o.id} className="border-t border-line align-top">
                  <th scope="row" className="p-2 text-left font-medium">{o.label}</th>
                  {CANDS.map((c) => {
                    const raw = currentOptionScore(q, o, positions.find((p) => p.candidateId === c.id && p.questionId === q.id));
                    const hasProposal = q.options.some((x) => proposedOptionScore(q.id, c.id, x.id));
                    if (raw === null && !hasProposal) return <td key={c.id} className="p-2 italic text-ink-3">sem posição</td>;
                    const now = raw ?? 0;
                    cells++;
                    const prop = proposedOptionScore(q.id, c.id, o.id);
                    if (prop && prop.score !== now) {
                      changed++;
                      return (
                        <td key={c.id} title={`Hoje: ${raw === null ? "sem posição" : fmt(now)}. ${prop.reason}`} className={`p-2 outline-2 -outline-offset-2 outline-purple ${tone(prop.score)}`}>
                          {fmt(prop.score)}
                        </td>
                      );
                    }
                    return <td key={c.id} className={`p-2 ${tone(now)}`}>{fmt(now)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  ));

  return (
    <div className="container-page py-12 space-y-8">
      <AdminNav current="/admin/notas" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle eyebrow="Admin" tone="gold" lead="Proposta para revisão: nada aqui mudou a conta do site ainda. Para cada pergunta, quanto cada candidato ganharia se a pessoa marcasse cada alternativa.">
          Notas por alternativa
        </PageTitle>
        <div className="flex flex-wrap items-center gap-2 print:hidden"><PrintButton label="Exportar PDF" fileTitle="Notas por alternativa" /><form action={logoutAction}><button className="rounded-lg border border-line px-3 py-2 text-sm min-h-11">Sair</button></form></div>
      </div>
      <div className="card p-4 text-sm space-y-2">
        <p className="flex flex-wrap gap-2"><span className="rounded-md bg-mint-soft px-2 font-semibold">1 = ele defende isso</span><span className="rounded-md bg-gold-soft px-2">0,5 = defende em parte</span><span className="px-2 text-ink-3">0 = não defende</span></p>
        <p>Células com borda roxa mudariam em relação à regra de hoje. Passe o mouse sobre elas para ver a nota atual e o motivo. As demais seguem a regra atual: 1 na alternativa do candidato, 0,5 na vizinha. &quot;Sem posição&quot; conta como 0. &quot;Não sei&quot; nunca entra na conta.</p>
        <p>Resultado de cada tema = soma do que o candidato ganhou ÷ perguntas respondidas. Ganha o tema quem tiver a porcentagem maior.</p>
        <p className="font-semibold">{changed} das {cells} notas mudariam.</p>
      </div>
      {body}
    </div>
  );
}
