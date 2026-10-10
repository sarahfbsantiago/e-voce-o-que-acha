"use client";

import { sameJson } from "@/lib/live-config";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setContentAction, uploadFigureImageAction } from "@/app/admin/config-actions";

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
const HIDDEN = new Set(["candidateId", "documentedActionCategories", "topicIds", "topicId"]);
const input = "w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30";

/** Esvazia textos de um item para servir de modelo ao "+ Adicionar". */
function blankLike(v: Json): Json {
  if (typeof v === "string") return "";
  if (typeof v === "number") return 0;
  if (Array.isArray(v)) return v.length && typeof v[0] !== "object" ? [] : v.length ? [blankLike(v[0])] : [];
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === "t" ? x : blankLike(x)]));
  return v;
}

/** Foto do personagem: miniatura, trocar (envia PNG/JPG/WEBP, reduzida para no máx. 600 px) ou remover. */
function FigurePhoto({ slug, name, set }: { slug: string; name: string; set: (slug: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true); setErr("");
    try {
      const bmp = await createImageBitmap(file);
      const scale = Math.min(1, 600 / Math.max(bmp.width, bmp.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bmp.width * scale); canvas.height = Math.round(bmp.height * scale);
      canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
      const type = file.type === "image/png" ? "image/png" : "image/jpeg";
      const blob: Blob = await new Promise((ok) => canvas.toBlob((b) => ok(b!), type, 0.85));
      const fd = new FormData();
      fd.append("file", new File([blob], file.name, { type }));
      const r = await uploadFigureImageAction(fd);
      if (r.slug) set(r.slug); else setErr(r.error ?? "Não foi possível enviar.");
    } catch { setErr("Não foi possível ler a imagem."); }
    setBusy(false);
  };
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg bg-paper/60 p-2 ring-1 ring-line">
      {slug ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/historia-img/${slug}`} alt={`Foto de ${name}`} className="h-24 w-20 rounded object-cover ring-1 ring-line" />
      ) : <span className="grid h-24 w-20 place-items-center rounded bg-line text-[10px] text-ink-3">sem foto</span>}
      <div className="space-y-1.5">
        <label className={`admin-press inline-flex cursor-pointer items-center rounded-lg bg-gradient-to-r from-purple to-[#2563eb] px-3 py-1.5 text-xs font-bold text-white ${busy ? "opacity-50" : ""}`}>
          {busy ? "Enviando…" : slug ? "Trocar imagem" : "Inserir imagem"}
          <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={busy} onChange={(e) => pick(e.target.files?.[0])} />
        </label>
        {slug ? <button type="button" onClick={() => set("")} className="block rounded-lg bg-surface px-3 py-1 text-xs font-bold text-[#9b1c1c] ring-1 ring-[#f5b5b5]">Remover foto</button> : null}
        <p className="text-[10px] text-ink-3">PNG, JPG ou WEBP até 3 MB. Lembre de atualizar o crédito da foto.</p>
        {err ? <p className="text-[11px] font-semibold text-[#9b1c1c]">{err}</p> : null}
      </div>
    </div>
  );
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
  const isFigure = typeof v.slug === "string" && typeof v.name === "string";
  return (
    <div className="space-y-2">
      {isFigure ? <FigurePhoto slug={v.slug as string} name={v.name as string} set={(slug) => set({ ...v, slug })} /> : null}
      {Object.entries(v).filter(([ck]) => !(isFigure && ck === "slug")).map(([ck, cv]) => <Node key={ck} k={ck} v={cv} set={(nv) => set({ ...v, [ck]: nv })} />)}
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
          className="admin-press rounded-lg bg-gradient-to-r from-purple to-[#2563eb] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40">{pending ? "Salvando…" : "Salvar no rascunho"}</button>
        <button type="button" disabled={!dirty} onClick={() => setV(value)} className="rounded-lg bg-surface px-3 py-1.5 text-xs font-semibold text-ink-2 ring-1 ring-line disabled:opacity-40">Desfazer</button>
        {differsFromLive ? <button type="button" onClick={() => setV(published)} className="rounded-lg bg-surface px-3 py-1.5 text-xs font-semibold text-ink-2 ring-1 ring-line">Voltar ao que está no ar</button> : null}
        {saved ? <span className="text-xs font-bold text-mint-strong">✓ Salvo no rascunho</span> : null}
      </div>
    </div>
  );
}
