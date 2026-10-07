import type { Candidate, CandidateProfile, ProgramSummary, SourceRegistryEntry, SourcedFact } from "@/domain/types";
import { NO_SPECIFIC_PROPOSAL_MESSAGE } from "@/domain/types";
import { EXPERIENCE_ROWS, PROGRAM_2026_THEMES } from "@/data/candidate-profiles";
import { SourceLegendBadge, SourceLink } from "@/components/SourceBits";
import { Modal } from "@/components/Modal";
import { formatDate } from "@/lib/format";

interface Props {
  ordered: Candidate[];
  profiles: CandidateProfile[];
  summaries: ProgramSummary[];
  sourceById: Record<string, SourceRegistryEntry>;
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
export function CandidatesSection({ ordered, profiles, summaries, sourceById }: Props) {
  const tse = sourceById["tse-planos-2026"];
  const tseDiv = sourceById["tse-divulgacandcontas"];
  return (
    <section aria-labelledby="candidatos" className="space-y-5">
      <div>
        <h2 id="candidatos" className="text-xl font-bold border-l-4 border-purple pl-3">Trajetória de cada candidato</h2>
        <p className="text-sm text-ink-2 mt-1 max-w-3xl">Mesmos critérios para os dois. Abra a trajetória completa para ver datas, cargos e fontes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ordered.map((c) => {
          const p = profiles.find((x) => x.candidateId === c.id);
          if (!p) return <div key={c.id} className="card p-5"><h3 className="font-semibold text-lg">{c.name}</h3><p className="text-sm text-ink-2 mt-2">Perfil ainda não cadastrado.</p></div>;
          const program = summaries.filter((s) => s.candidateId === c.id);
          const cargo2026 = EXPERIENCE_ROWS.find((r) => r.label === "Cargo em 2026")?.byCandidate[c.id];
          return (
            <article key={c.id} className="card card-lift p-5 md:p-6 flex flex-col gap-4" aria-labelledby={`cand-${c.id}`}>
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
                    {p.keyInitiatives.slice(0, 5).map((k) => (
                      <li key={k.url} className="flex items-baseline gap-2">
                        <span className="shrink-0 text-xs text-ink-3 tabular-nums">{k.year}</span>
                        <a href={k.url} target="_blank" rel="noopener noreferrer" className="min-w-0 text-[13px] leading-snug text-accent underline underline-offset-4 hover:text-purple-strong">{k.title}</a>
                      </li>
                    ))}
                  </ul>
                  {p.keyInitiatives.length > 5 ? <p className="mt-1 text-xs text-ink-3"><span className="print:hidden">+{p.keyInitiatives.length - 5} no detalhe</span><span className="hidden print:inline">+{p.keyInitiatives.length - 5} na versão online do relatório</span></p> : null}
                </div>
              ) : null}
              <div className="mt-auto">
                <Modal trigger={`Ver trajetória completa de ${c.name.split(" ")[0]}`} title={`Trajetória de ${c.name}`} variant="primary" className="w-full">
                  <CandidateDetails c={c} p={p} program={program} sourceById={sourceById} tse={tse} />
                </Modal>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
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
        <Modal trigger="Links oficiais" title="Links oficiais">
          <ul className="grid gap-2 text-sm">
            {tse ? <li><SourceLink source={tse} label="Consultar todos os programas no TSE" /></li> : null}
            {tseDiv ? <li><SourceLink source={tseDiv} label="DivulgaCandContas (documentos das candidaturas)" /></li> : null}
            {ordered.flatMap((c) => tse ? [
              <li key={`${c.id}-p`}><SourceLink source={tse} label={`Programa de ${c.name}`} /></li>,
              <li key={`${c.id}-a`}><SourceLink source={tse} label={`Propostas de ${c.name} por assunto`} /></li>,
            ] : [])}
          </ul>
          {tse?.verification.status !== "VERIFIED" ? <p className="mt-3 text-xs text-ink-3">O portal do TSE bloqueia acesso automatizado; os links acima apontam para a página oficial das Eleições 2026 até a confirmação manual dos endereços de cada documento.</p> : null}
        </Modal>
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

function CandidateDetails({ c, p, program, sourceById, tse }: { c: Candidate; p: CandidateProfile; program: ProgramSummary[]; sourceById: Record<string, SourceRegistryEntry>; tse?: SourceRegistryEntry }) {
  const programSource = sourceById[`tse-proposta-governo-2026-${c.id}`] ?? tse;
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
        <HowDoWeKnow fact={p.shortBio} sourceById={sourceById} />
      </Block>

      <Block title="Principais realizações, propostas e posições">
        {highlights.length ? (
          <HighlightGrid items={highlights} candidateId={c.id} candidateName={c.name} programSource={programSource} />
        ) : (
          <p className="text-sm text-ink-2">{NO_SPECIFIC_PROPOSAL_MESSAGE}</p>
        )}
      </Block>

      <Block title="Currículo">
        {p.professionalExperience?.length ? (
          <ul className="space-y-2">
            {p.professionalExperience.map((f, i) => (
              <li key={i} className="text-sm"><span className="font-semibold text-accent">{f.date}</span> — {f.text} <HowDoWeKnow fact={f} sourceById={sourceById} inline /></li>
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
              <span className="font-semibold text-accent">{t.date}</span> — {t.text} <HowDoWeKnow fact={t} sourceById={sourceById} inline />
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
              <HowDoWeKnow fact={{ text: pos.title, sourceIds: pos.sourceIds, verified: pos.verified, date: pos.from }} sourceById={sourceById} inline />
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Experiência de governo">
        <ul className="space-y-2">
          {p.governmentExperience.map((g, i) => (
            <li key={i} className="text-sm">{g.text} <HowDoWeKnow fact={g} sourceById={sourceById} inline /></li>
          ))}
        </ul>
      </Block>

      {p.keyInitiatives?.length ? (
        <Block title={c.id === "lula" ? "Leis, decretos e programas (seleção)" : "Projetos e propostas (seleção)"}>
          <p className="text-xs text-ink-3">Só o nome, o ano e o link oficial. Autoria de projeto não equivale à aprovação de uma lei; lei sancionada não mede resultado.</p>
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
                    <a href={k.url} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline underline-offset-4 hover:text-purple-strong">{k.title} <span aria-hidden="true">↗</span></a>
                    <span className="text-xs text-ink-3">{k.kind}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null)}
        </Block>
      ) : null}



      <Block title="Links oficiais">
        <ul className="space-y-1 text-sm">
          {p.officialLinks.map((l, i) => {
            const s = sourceById[l.sourceId];
            return s ? <li key={i} className="flex flex-wrap items-center gap-2"><SourceLegendBadge legend={s.legend} /><SourceLink source={s} label={l.label} />{l.note ? <span className="text-xs text-ink-3">({l.note})</span> : null}</li> : null;
          })}
        </ul>
      </Block>
    </div>
  );
}

type Highlight = { theme: string; text: string; pages: number[]; url?: string; label?: string; group?: string };

/** Quadrados curtos, agrupados por área quando há grupo; tudo visível, sem expandir (o pop-up rola). */
function HighlightGrid({ items, candidateId, candidateName, programSource }: { items: Highlight[]; candidateId: string; candidateName: string; programSource?: SourceRegistryEntry }) {
  const pdf = `/programas/2026-${candidateId}.pdf`;
  const Card = ({ h }: { h: Highlight }) => (
    <li className="rounded-lg border border-line bg-paper/60 p-3 text-sm">
      <p className="font-semibold">{h.theme}</p>
      <p className="mt-1 text-ink-2 leading-snug">{h.text}</p>
      <p className="mt-1 flex flex-wrap gap-x-2 text-[11px] text-ink-3">
        {h.pages.length ? (
          <a href={`${pdf}#page=${h.pages[0]}`} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-purple-strong">Programa no TSE, p. {h.pages.join(", ")} <span aria-hidden="true">↗</span></a>
        ) : null}
        {h.url ? <a href={h.url} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-purple-strong">{h.label ?? "documento"} <span aria-hidden="true">↗</span></a> : null}
      </p>
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
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <a href={pdf} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline underline-offset-4 hover:text-purple-strong">Programa completo de {candidateName} (PDF oficial, cópia do arquivo do TSE) <span aria-hidden="true">↗</span></a>
        {programSource ? <SourceLink source={programSource} label="Página do TSE" /> : null}
      </div>
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

/** "Como sabemos disso?": fonte, instituição, data, trecho, link e tipo de evidência. */
function HowDoWeKnow({ fact, sourceById, inline = false }: { fact: SourcedFact; sourceById: Record<string, SourceRegistryEntry>; inline?: boolean }) {
  return (
    <details className={inline ? "inline" : "mt-1"}>
      <summary className="text-xs text-accent font-medium inline">Como sabemos disso?</summary>
      <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-ink-2 rounded-md border border-line p-2">
        <dt className="font-semibold">Fonte</dt><dd>{fact.sourceIds.map((id) => sourceById[id]?.name ?? id).join("; ")}</dd>
        <dt className="font-semibold">Instituição</dt><dd>{[...new Set(fact.sourceIds.map((id) => sourceById[id]?.institution).filter(Boolean))].join("; ") || "—"}</dd>
        <dt className="font-semibold">Data</dt><dd>{fact.date ?? "—"}</dd>
        <dt className="font-semibold">Trecho utilizado</dt><dd>{fact.excerpt ?? (fact.verified ? "—" : "Informação da especificação do projeto, pendente de conferência na fonte indicada.")}</dd>
        <dt className="font-semibold">Link original</dt>
        <dd className="flex flex-wrap gap-2">{fact.sourceIds.map((id) => sourceById[id] ? <SourceLink key={id} source={sourceById[id]} label={sourceById[id].institution} /> : null)}</dd>
        {fact.links?.length ? (
          <>
            <dt className="font-semibold">Documentos</dt>
            <dd>
              <ul className="space-y-0.5">
                {fact.links.map((l) => (
                  <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-purple-strong">{l.label} <span aria-hidden="true">↗</span></a></li>
                ))}
              </ul>
            </dd>
          </>
        ) : null}
        <dt className="font-semibold">Tipo de evidência</dt><dd>{[...new Set(fact.sourceIds.map((id) => sourceById[id]?.legend).filter(Boolean))].map((l) => <SourceLegendBadge key={l} legend={l!} />)}</dd>
        <dt className="font-semibold">Status</dt><dd>{fact.verified ? "Conferido na fonte" : "Pendente de conferência"}</dd>
      </dl>
    </details>
  );
}
