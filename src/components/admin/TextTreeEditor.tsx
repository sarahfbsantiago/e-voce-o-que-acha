"use client";

import { sameJson } from "@/lib/live-config";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setContentAction } from "@/app/admin/config-actions";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

/** Nomes amigáveis dos campos. */
const LABELS: Record<string, string> = {
  headline: "Título", card1Title: "Cartão 1: título", card1Text: "Cartão 1: texto", card2Title: "Cartão 2: título", card2Text: "Cartão 2: texto", notice: "Aviso",
  titleHome: "Título (página inicial)", titleOther: "Título (outras páginas)", subtitle: "Subtítulo", about: "Sobre", bottom: "Linha final", lead: "Introdução",
  steps: "Passos", title: "Título", text: "Texto", sections: "Seções", blocks: "Blocos", items: "Itens", finalMessage: "Mensagem final", footerIntro: "Rodapé do relatório",
  heading: "Título do perfil", summary: "Resumo", economy: "Na economia", society: "Na sociedade", state: "O papel do Estado", futureLabel: "Rótulo do futuro", future: "O futuro", keywords: "Palavras-chave",
  figures: "Personagens", name: "Nome", years: "Anos", caption: "Legenda", credit: "Crédito da foto", author: "Autor", license: "Licença", page: "Link da foto", slug: "Foto (arquivo)",
  chapters: "Capítulos", timeline: "Linha do tempo", lead2: "Destaque", label: "Texto do link", href: "Link", rows: "Linhas", head: "Cabeçalho",
  shortBio: "Resumo", professionalExperience: "Currículo", date: "Data", positionsHeld: "Cargos", from: "De", to: "Até", branch: "Poder", governmentExperience: "Experiência de governo",
  keyInitiatives: "Projetos e programas", year: "Ano", kind: "Tipo", url: "Link", programHighlights: "Principais propostas", theme: "Tema", group: "Grupo", pages: "Páginas",
  officialLinks: "Links oficiais", note: "Observação", sourceId: "Fonte (código)", sourceIds: "Fontes (códigos)", list: "Lista", t: "Tipo do bloco", id: "Identificador",
};
const label = (k: string | number) => (typeof k === "number" ? `#${k + 1}` : LABELS[k] ?? k);
const HIDDEN = new Set(["candidateId", "documentedActionCategories"]);
const input = "w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30";

/** Esvazia textos de um item para servir de modelo ao "+ Adicionar". */
function blankLike(v: Json): Json {
  if (typeof v === "string") return "";
  if (typeof v === "number") return 0;
  if (Array.isArray(v)) return v.length && typeof v[0] !== "object" ? [] : v.length ? [blankLike(v[0])] : [];
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === "t" ? x : blankLike(x)]));
  return v;
}

function Node({ k, v, set }: { k: string | number; v: Json; set: (v: Json) => void }) {
  if (typeof k === "string" && HIDDEN.has(k)) return null;
  if (typeof v === "string") {
    if (k === "t") return <p className="text-[11px] text-ink-3">Bloco: {v === "p" ? "parágrafo" : v === "ul" ? "lista" : v === "ol" ? "lista numerada" : v === "h" ? "subtítulo" : v}</p>;
    const long = v.length > 70 || /text|summary|caption|economy|society|state|future|finalMessage|footerIntro|about/i.test(String(k));
    return (
      <label className="block text-xs font-semibold text-ink-2">{label(k)}
        {long ? <textarea className={`${input} mt-1`} rows={Math.min(8, Math.max(2, Math.ceil(v.length / 90)))} value={v} onChange={(e) => set(e.target.value)} /> : <input className={`${input} mt-1`} value={v} onChange={(e) => set(e.target.value)} />}
      </label>
    );
  }
  if (typeof v === "number") return <label className="block text-xs font-semibold text-ink-2">{label(k)}<input type="number" className={`${input} mt-1 w-32`} value={v} onChange={(e) => set(Number(e.target.value))} /></label>;
  if (typeof v === "boolean" || v === null) return null;
  if (Array.isArray(v)) {
    const simple = v.every((x) => typeof x !== "object" || x === null);
    return (
      <fieldset className="space-y-2 rounded-xl bg-paper/60 p-3 ring-1 ring-line">
        <legend className="px-1 text-xs font-bold uppercase tracking-wide text-ink-3">{label(k)}</legend>
        {v.map((item, i) => (
          <div key={i} className={`relative ${simple ? "flex items-start gap-2" : "rounded-lg bg-surface p-3 pr-10 ring-1 ring-line"}`}>
            <div className="min-w-0 flex-1 space-y-2"><Node k={simple ? i : i} v={item} set={(nv) => set(v.map((x, j) => (j === i ? nv : x)))} /></div>
            <button type="button" aria-label="Remover" onClick={() => set(v.filter((_, j) => j !== i))} className={`${simple ? "mt-5" : "absolute right-2 top-2"} h-7 w-7 shrink-0 rounded-lg text-ink-3 ring-1 ring-line hover:text-[#9b1c1c]`}>×</button>
          </div>
        ))}
        <button type="button" onClick={() => set([...v, v.length ? blankLike(v[v.length - 1]) : ""])} className="rounded-lg bg-surface px-3 py-1 text-xs font-bold text-purple-strong ring-1 ring-purple/30">+ Adicionar</button>
      </fieldset>
    );
  }
  return (
    <div className="space-y-2">
      {Object.entries(v).map(([ck, cv]) => <Node key={ck} k={ck} v={cv} set={(nv) => set({ ...v, [ck]: nv })} />)}
    </div>
  );
}

/** Editor genérico de um trecho dos textos do site: campos, listas, adicionar e remover; salva no rascunho. */
export function TextTreeEditor({ path, value, published }: { path: (string | number)[]; value: Json; published: Json }) {
  const router = useRouter();
  const [v, setV] = useState<Json>(value);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const dirty = !sameJson(v, value);
  const differsFromLive = !sameJson(value, published);
  return (
    <div className="space-y-3">
      {differsFromLive ? <p className="rounded-lg bg-[#fff4e5] px-3 py-1.5 text-xs font-semibold text-[#7a4a00] ring-1 ring-[#f5c27a]">Este trecho tem mudanças no rascunho, ainda não publicadas.</p> : null}
      <Node k={String(path[path.length - 1])} v={v} set={(nv) => { setV(nv); setSaved(false); }} />
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" disabled={!dirty || pending} onClick={() => start(async () => { await setContentAction(path, v); setSaved(true); router.refresh(); })}
          className="rounded-lg bg-gradient-to-r from-purple to-[#2563eb] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40">{pending ? "Salvando…" : "Salvar no rascunho"}</button>
        <button type="button" disabled={!dirty} onClick={() => setV(value)} className="rounded-lg bg-surface px-3 py-1.5 text-xs font-semibold text-ink-2 ring-1 ring-line disabled:opacity-40">Desfazer</button>
        {differsFromLive ? <button type="button" onClick={() => setV(published)} className="rounded-lg bg-surface px-3 py-1.5 text-xs font-semibold text-ink-2 ring-1 ring-line">Voltar ao que está no ar</button> : null}
        {saved ? <span className="text-xs font-bold text-mint-strong">✓ Salvo no rascunho</span> : null}
      </div>
    </div>
  );
}
