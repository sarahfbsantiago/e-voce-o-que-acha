"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addOptionAction, archiveQuestionAction, createQuestionAction, restoreQuestionAction, updateQuestionAction } from "@/app/admin/config-actions";

type Opt = { id: string; label: string; noOpinion?: boolean };
type Band = { label: string; color: string };
type NewOpt = { label: string; lula: number; flavio: number; band: string };

const input = "w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30";
const SCORES = [{ v: 1, l: "1" }, { v: 0.5, l: "0,5" }, { v: 0, l: "0" }];

function OptionRow({ o, set, bands, onRemove }: { o: NewOpt; set: (o: NewOpt) => void; bands: Band[]; onRemove?: () => void }) {
  return (
    <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-2 rounded-lg bg-paper/50 p-2 sm:grid-cols-[1fr_auto_auto_auto_auto] sm:bg-transparent sm:p-0">
      <input className={`${input} col-span-4 sm:col-span-1`} value={o.label} onChange={(e) => set({ ...o, label: e.target.value })} placeholder="Texto da alternativa" maxLength={200} />
      <label className="text-[11px] font-semibold text-[#562f9f]">Lula<select className={`${input} mt-0.5 w-16`} value={o.lula} onChange={(e) => set({ ...o, lula: Number(e.target.value) })}>{SCORES.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}</select></label>
      <label className="text-[11px] font-semibold text-[#237a49]">Flávio<select className={`${input} mt-0.5 w-16`} value={o.flavio} onChange={(e) => set({ ...o, flavio: Number(e.target.value) })}>{SCORES.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}</select></label>
      <label className="text-[11px] font-semibold text-ink-2">Faixa<select className={`${input} mt-0.5 w-full sm:w-36`} value={o.band} onChange={(e) => set({ ...o, band: e.target.value })}>{bands.map((b) => <option key={b.label} value={b.label}>{b.label}</option>)}</select></label>
      {onRemove ? <button type="button" onClick={onRemove} aria-label="Remover alternativa" className="mt-4 h-8 w-8 rounded-lg text-ink-3 ring-1 ring-line hover:text-[#9b1c1c]">×</button> : <span />}
    </div>
  );
}

/** Edita texto, exemplo e alternativas de uma pergunta; acrescenta alternativa; arquiva ou restaura. Tudo no rascunho. */
export function QuestionEditor({ id, text, example, options, archived, bands, isNew }: { id: string; text: string; example: string; options: Opt[]; archived: boolean; bands: Band[]; isNew: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [t, setT] = useState(text);
  const [ex, setEx] = useState(example);
  const [labels, setLabels] = useState<Record<string, string>>(Object.fromEntries(options.map((o) => [o.id, o.label])));
  const [adding, setAdding] = useState<NewOpt | null>(null);
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<void>) => start(async () => { await fn(); router.refresh(); });
  const dirty = t !== text || ex !== example || options.some((o) => labels[o.id] !== o.label);

  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-wrap gap-2">
        {!archived ? <button type="button" onClick={() => setOpen(!open)} className="rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-purple-strong ring-1 ring-purple/30 hover:bg-purple-soft">{open ? "Fechar edição" : "Editar"}</button> : null}
        {!archived ? <button type="button" onClick={() => setAdding(adding ? null : { label: "", lula: 0, flavio: 0, band: "Centro" })} className="rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-ink-2 ring-1 ring-line hover:bg-paper">+ Alternativa</button> : null}
        {archived ? (
          <button type="button" disabled={pending} onClick={() => run(() => restoreQuestionAction(id))} className="rounded-lg bg-mint px-3 py-1.5 text-xs font-bold text-white">Restaurar pergunta</button>
        ) : (
          <button type="button" disabled={pending} onClick={() => { if (window.confirm(isNew ? "Remover esta pergunta nova do rascunho?" : "Arquivar esta pergunta? Ela sai do questionário e da conta ao publicar; as respostas antigas ficam guardadas.")) run(() => archiveQuestionAction(id)); }} className="rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-[#9b1c1c] ring-1 ring-[#f5b5b5] hover:bg-[#fde8e8]">Arquivar</button>
        )}
      </div>

      {open ? (
        <div className="space-y-2 rounded-xl bg-paper/70 p-3 ring-1 ring-line">
          <label className="block text-xs font-semibold text-ink-2">Pergunta<textarea className={`${input} mt-1`} rows={2} value={t} onChange={(e) => setT(e.target.value)} maxLength={600} /></label>
          <label className="block text-xs font-semibold text-ink-2">Exemplo (opcional)<textarea className={`${input} mt-1`} rows={2} value={ex} onChange={(e) => setEx(e.target.value)} maxLength={1200} /></label>
          <p className="text-xs font-semibold text-ink-2">Alternativas</p>
          {options.map((o) => (
            <div key={o.id} className="flex items-center gap-2">
              <input className={`${input} flex-1 ${o.noOpinion ? "bg-paper" : ""}`} value={labels[o.id]} onChange={(e) => setLabels({ ...labels, [o.id]: e.target.value })} maxLength={200} aria-label={o.noOpinion ? "Alternativa sem opinião" : "Alternativa"} />
            </div>
          ))}
          <p className="text-[11px] text-ink-3">Notas e faixas destas alternativas: em Notas e espectro.</p>
          <button type="button" disabled={!dirty || pending || !t.trim()} onClick={() => run(() => updateQuestionAction(id, { text: t, example: ex, labels }))} className="admin-press rounded-lg bg-gradient-to-r from-purple to-[#2563eb] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40">{pending ? "Salvando…" : "Salvar no rascunho"}</button>
        </div>
      ) : null}

      {adding ? (
        <div className="space-y-2 rounded-xl bg-paper/70 p-3 ring-1 ring-line">
          <p className="text-xs font-semibold text-ink-2">Nova alternativa (entra antes de &quot;Não sei&quot;)</p>
          <OptionRow o={adding} set={setAdding} bands={bands} />
          <button type="button" disabled={!adding.label.trim() || pending} onClick={() => run(async () => { await addOptionAction(id, adding); setAdding(null); })} className="admin-press rounded-lg bg-gradient-to-r from-purple to-[#2563eb] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40">Adicionar no rascunho</button>
        </div>
      ) : null}
    </div>
  );
}

/** Pergunta nova: tema, texto, exemplo e, em cada alternativa, nota do Lula, nota do Flávio e faixa na régua. */
export function NewQuestionForm({ topics, bands }: { topics: { id: string; name: string; area: string }[]; bands: Band[] }) {
  const router = useRouter();
  const blank = (): NewOpt => ({ label: "", lula: 0, flavio: 0, band: "Centro" });
  const [topicId, setTopicId] = useState(topics[0]?.id ?? "");
  const [text, setText] = useState("");
  const [example, setExample] = useState("");
  const [opts, setOpts] = useState<NewOpt[]>([blank(), blank(), blank()]);
  const [pending, start] = useTransition();
  const filled = opts.filter((o) => o.label.trim());
  const ok = text.trim().length > 5 && filled.length >= 2;
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-[260px_1fr]">
        <label className="block text-xs font-semibold text-ink-2">Tema
          <select className={`${input} mt-1`} value={topicId} onChange={(e) => setTopicId(e.target.value)}>{topics.map((t) => <option key={t.id} value={t.id}>{t.area} · {t.name}</option>)}</select>
        </label>
        <label className="block text-xs font-semibold text-ink-2">Pergunta<textarea className={`${input} mt-1`} rows={2} value={text} onChange={(e) => setText(e.target.value)} maxLength={600} placeholder="Ex.: O governo deveria…?" /></label>
      </div>
      <label className="block text-xs font-semibold text-ink-2">Exemplo (opcional)<textarea className={`${input} mt-1`} rows={2} value={example} onChange={(e) => setExample(e.target.value)} maxLength={1200} /></label>
      <p className="text-xs font-semibold text-ink-2">Alternativas: para cada uma, a nota do Lula, a nota do Flávio e a faixa na régua (&quot;Não sei&quot; entra sozinho)</p>
      <div className="space-y-2">{opts.map((o, i) => <OptionRow key={i} o={o} bands={bands} set={(v) => setOpts(opts.map((x, j) => (j === i ? v : x)))} onRemove={opts.length > 2 ? () => setOpts(opts.filter((_, j) => j !== i)) : undefined} />)}</div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setOpts([...opts, blank()])} className="rounded-lg bg-surface px-3 py-1.5 text-xs font-bold text-ink-2 ring-1 ring-line">+ Alternativa</button>
        <button type="button" disabled={!ok || pending} onClick={() => start(async () => { await createQuestionAction({ topicId, text, example, options: filled }); setText(""); setExample(""); setOpts([blank(), blank(), blank()]); router.refresh(); })}
          className="admin-press rounded-lg bg-gradient-to-r from-purple to-[#2563eb] px-4 py-1.5 text-xs font-bold text-white disabled:opacity-40">{pending ? "Salvando…" : "Criar no rascunho"}</button>
      </div>
    </div>
  );
}
