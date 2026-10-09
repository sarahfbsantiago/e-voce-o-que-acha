import Link from "next/link";
import type { Candidate, CandidateProfile, ProgramSummary } from "@/domain/types";
import { NO_SPECIFIC_PROPOSAL_MESSAGE } from "@/domain/types";
import { EXPERIENCE_ROWS, PROGRAM_2026_THEMES } from "@/data/candidate-profiles";
import { Modal } from "@/components/Modal";
import { formatDate } from "@/lib/format";

interface Props {
  ordered: Candidate[];
  profiles: CandidateProfile[];
  summaries: ProgramSummary[];
}

/** Primeiras frases de um texto, para o cartão resumido. */
function firstSentences(text: string, n: number) {
  return text.split(/(?<=\.)\s+/).slice(0, n).join(" ");
}

/**
 * "Trajetória de cada candidato": um cartão curto por candidato, com os mesmos critérios
 * para os dois, e um pop-up com a trajetória completa, cargos, atuação documentada,
 * programa de 2026 e links oficiais. Nada aqui é preenchido com conhecimento do modelo.
 */
export function CandidatesSection({ ordered, profiles, summaries }: Props) {
  return (
    <section aria-labelledby="candidatos" className="space-y-5">
      <div>
        <h2 id="candidatos" className="text-xl font-bold border-l-4 border-purple pl-3">Trajetória de cada candidato</h2>
        <p className="text-sm text-ink-2 mt-1 max-w-3xl">Mesmos critérios para os dois. Toque no candidato para abrir o currículo completo.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 print:grid-cols-1">
        {ordered.map((c) => {
          const p = profiles.find((x) => x.candidateId === c.id);
          if (!p) return <div key={c.id} className="card p-5"><h3 className="font-semibold text-lg">{c.name}</h3><p className="text-sm text-ink-2 mt-2">Perfil ainda não cadastrado.</p></div>;
          const program = summaries.filter((s) => s.candidateId === c.id);
          const cargo2026 = EXPERIENCE_ROWS.find((r) => r.label === "Cargo em 2026")?.byCandidate[c.id];
          return (
            <div key={c.id} className="contents">
              <Modal plainTrigger title={`Currículo de ${c.name}`} className="group spectrum-btn flex w-full flex-col justify-start rounded-2xl p-5 text-left md:p-6" trigger={
                <span className="flex flex-col gap-3">
                  <span className="flex items-start justify-between gap-3">
                    <span>
                      <span className="block text-lg font-bold text-ink">{c.name}</span>
                      {cargo2026 ? <span className="mt-0.5 block text-xs uppercase tracking-wide text-ink-3">{cargo2026}</span> : null}
                    </span>
                    <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-purple text-sm font-bold text-white shadow-sm transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                  <span className="block text-sm leading-relaxed text-ink-2">{firstSentences(p.shortBio.text, 2)}</span>
                  <span className="grid grid-cols-3 gap-2 text-center">
                    {[["Na política desde", String(p.trajectoryStart.year)], ["Primeira eleição", String(p.firstElection.year)], [`Anos até ${p.approxYearsOfExperience.until}`, `~${p.approxYearsOfExperience.years}`]].map(([l, v]) => (
                      <span key={l} className="rounded-xl bg-surface/80 px-1.5 py-2 ring-1 ring-purple/15"><span className="block text-[10px] leading-tight text-ink-3 sm:text-[11px]">{l}</span><span className="mt-1 block text-base font-bold text-accent sm:text-lg">{v}</span></span>
                    ))}
                  </span>
                  <span className="text-sm font-semibold text-purple-strong">Abrir currículo completo →</span>
                </span>
              }>
                <CandidateDetails c={c} p={p} program={program} />
              </Modal>
              <article key={c.id} className="card hidden p-5 md:p-6 flex-col gap-4 print:flex" aria-labelledby={`cand-${c.id}`}>
              <div>
                <h3 id={`cand-${c.id}`} className="text-lg font-bold">{c.name}</h3>
                {cargo2026 ? <p className="text-xs uppercase tracking-wide text-ink-3 mt-0.5">{cargo2026}</p> : null}
              </div>
              <p className="text-sm text-ink-2 leading-relaxed">{firstSentences(p.shortBio.text, 2)}</p>
              {p.professionalExperience?.length ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Currículo</p>
                  <ul className="mt-1.5 space-y-1 text-[13px] leading-snug text-ink-2">
                    {p.professionalExperience.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-baseline gap-2"><span className="shrink-0 text-xs text-ink-3 tabular-nums">{f.date}</span><span>{f.text}</span></li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Cargos públicos</p>
                <ul className="mt-1.5 space-y-1 text-[13px] leading-snug text-ink-2">
                  {p.positionsHeld.map((pos, i) => (
                    <li key={i} className="flex items-baseline gap-2">
                      <span className="shrink-0 text-xs text-ink-3 tabular-nums">{pos.from.slice(0, 4)}–{pos.to ? pos.to.slice(0, 4) : "hoje"}</span>
                      <span>{pos.title} <span className="text-ink-3">({pos.branch === "EXECUTIVO" ? "Executivo" : "Legislativo"})</span></span>
                    </li>
                  ))}
                </ul>
              </div>
              <dl className="grid grid-cols-3 gap-2 text-center">
                <Stat label="Na política desde" value={String(p.trajectoryStart.year)} />
                <Stat label="Primeira eleição" value={String(p.firstElection.year)} />
                <Stat label={`Anos até ${p.approxYearsOfExperience.until}`} value={`~${p.approxYearsOfExperience.years}`} />
              </dl>
              {p.keyInitiatives?.length ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Projetos e programas</p>
                  <ul className="mt-1.5 space-y-1 text-sm">
                    {p.keyInitiatives.map((k, idx) => (
                      <li key={k.url} className={`items-baseline gap-2 ${idx < 5 ? "flex" : "hidden print:flex"}`}>
                        <span className="shrink-0 text-xs text-ink-3 tabular-nums">{k.year}</span>
                        <span className="min-w-0 text-[13px] leading-snug">{k.title}</span>
                      </li>
                    ))}
                  </ul>
                  {p.keyInitiatives.length > 5 ? <p className="mt-1 text-xs text-ink-3 print:hidden">+{p.keyInitiatives.length - 5} no detalhe</p> : null}
                </div>
              ) : null}
              </article>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <Modal trigger="Comparar experiência" title="Comparação de experiência">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-paper text-left">
                  <th scope="col" className="p-2 border-b border-line">Informação</th>
                  {ordered.map((c) => <th key={c.id} scope="col" className="p-2 border-b border-line">{c.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {EXPERIENCE_ROWS.map((row) => (
                  <tr key={row.label} className="align-top">
                    <th scope="row" className="p-2 border-b border-line text-left font-medium">{row.label}</th>
                    {ordered.map((c) => <td key={c.id} className="p-2 border-b border-line">{row.byCandidate[c.id] ?? "—"}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
        <Link href="/fontes" className="inline-flex items-center gap-1 text-sm font-semibold text-purple underline underline-offset-4 hover:text-purple-strong">Veja as fontes →</Link>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper/60 px-1.5 py-2 sm:px-2 sm:py-2.5">
      <dt className="text-[10px] sm:text-[11px] leading-tight text-ink-3">{label}</dt>
      <dd className="mt-1 text-base sm:text-lg font-bold text-accent">{value}</dd>
    </div>
  );
}

function CandidateDetails({ c, p, program }: { c: Candidate; p: CandidateProfile; program: ProgramSummary[] }) {
  const highlights: Highlight[] = p.programHighlights?.length
    ? p.programHighlights
    : PROGRAM_2026_THEMES.flatMap((t) => {
        const item = program.find((s) => s.themeKey === `programa-2026:${t.key}`);
        if (!item) return [];
        const pages = (item.documentalStatus.match(/páginas? ([\d, ]+)/)?.[1] ?? "").split(",").map((x) => Number(x.trim())).filter((n) => n > 0);
        return [{ theme: t.label, text: item.title, pages }];
      });
  return (
    <div className="space-y-6">
      <Block title="Resumo">
        <p className="text-sm leading-relaxed">{p.shortBio.text}</p>
      </Block>

      <Block title="Principais realizações, propostas e posições">
        {highlights.length ? (
          <HighlightGrid items={highlights} />
        ) : (
          <p className="text-sm text-ink-2">{NO_SPECIFIC_PROPOSAL_MESSAGE}</p>
        )}
      </Block>

      <Block title="Currículo">
        {p.professionalExperience?.length ? (
          <ul className="space-y-2">
            {p.professionalExperience.map((f, i) => (
              <li key={i} className="text-sm"><span className="font-semibold text-accent">{f.date}</span> — {f.text}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-2">Não documentada nas fontes oficiais consultadas.</p>
        )}
      </Block>

      <Block title="Linha do tempo">
        <ol className="border-l-2 border-line pl-4 space-y-2">
          {p.timeline.map((t, i) => (
            <li key={i} className="text-sm">
              <span className="font-semibold text-accent">{t.date}</span> — {t.text}
            </li>
          ))}
        </ol>
      </Block>

      <Block title="Cargos ocupados">
        <ul className="space-y-2">
          {p.positionsHeld.map((pos, i) => (
            <li key={i} className="text-sm flex flex-wrap items-baseline gap-x-2">
              <span className="font-medium">{pos.title}</span>
              <span className="text-ink-2">{formatDate(pos.from)} a {pos.to ? formatDate(pos.to) : "em exercício (período eleitoral de 2026)"}</span>
              <span className="text-xs text-ink-3">{pos.branch === "EXECUTIVO" ? "Executivo" : "Legislativo"}</span>
             
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Experiência de governo">
        <ul className="space-y-2">
          {p.governmentExperience.map((g, i) => (
            <li key={i} className="text-sm">{g.text}</li>
          ))}
        </ul>
      </Block>

      {p.keyInitiatives?.length ? (
        <Block title={c.id === "lula" ? "Leis, decretos e programas (seleção)" : "Projetos e propostas (seleção)"}>
          <p className="text-xs text-ink-3">Só o nome e o ano. Autoria de projeto não equivale à aprovação de uma lei; lei sancionada não mede resultado.</p>
          {[
            [c.id === "lula" ? "Algumas das leis, decretos e programas" : "Alguns dos projetos de lei e PECs de sua autoria", p.keyInitiatives.filter((k) => !/^(Proposta|Medida provisória)/.test(k.kind))],
            ["Propostas e medidas recentes (situação jurídica diferente das políticas consolidadas)", p.keyInitiatives.filter((k) => /^(Proposta|Medida provisória)/.test(k.kind))],
          ].map(([label, items]) => (items as typeof p.keyInitiatives).length ? (
            <div key={label as string} className="mt-3">
              <p className="text-xs font-semibold text-ink-2">{label as string}</p>
              <ul className="mt-1 divide-y divide-line">
                {(items as NonNullable<typeof p.keyInitiatives>).map((k) => (
                  <li key={k.url} className="py-2 text-sm flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-xs text-ink-3 tabular-nums">{k.year}</span>
                    <span className="font-medium">{k.title}</span>
                    <span className="text-xs text-ink-3">{k.kind}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null)}
        </Block>
      ) : null}



      <div className="border-t border-line pt-4"><Link href="/fontes" className="inline-flex items-center gap-1 text-sm font-semibold text-purple underline underline-offset-4 hover:text-purple-strong">Veja as fontes →</Link></div>
    </div>
  );
}

type Highlight = { theme: string; text: string; pages: number[]; url?: string; label?: string; group?: string };

/** Quadrados curtos, agrupados por área quando há grupo; tudo visível, sem expandir (o pop-up rola). */
function HighlightGrid({ items }: { items: Highlight[] }) {
  const Card = ({ h }: { h: Highlight }) => (
    <li className="rounded-lg border border-line bg-paper/60 p-3 text-sm">
      <p className="font-semibold">{h.theme}</p>
      <p className="mt-1 text-ink-2 leading-snug">{h.text}</p>
    </li>
  );
  const groups: { name: string; items: Highlight[] }[] = [];
  for (const h of items) {
    const name = h.group ?? "";
    const g = groups.find((x) => x.name === name);
    if (g) g.items.push(h); else groups.push({ name, items: [h] });
  }
  return (
    <div className="space-y-4">
      {groups.map((g, gi) => (
        <div key={g.name || gi}>
          {g.name ? <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-3">{g.name}</p> : null}
          <ul className="grid gap-2 sm:grid-cols-2">{g.items.map((h) => <Card key={h.theme} h={h} />)}</ul>
        </div>
      ))}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-3">{title}</h4>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

