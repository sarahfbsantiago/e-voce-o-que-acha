import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";
import { ensureLiveConfig } from "@/lib/live-config-server";
import { questionnaireCounts } from "@/lib/live-config";
import { SITE_TEXTS, fillCounts } from "@/data/site-texts";

/** **negrito** vira <strong>. */
function rich(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) => (part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part));
}

export const metadata: Metadata = { title: "Metodologia" };

/** Texto da metodologia (editável no admin, aba Textos do site). */
export default async function MetodologiaPage() {
  await ensureLiveConfig();
  const c = questionnaireCounts();
  return (
    <div className="container-page py-7 md:py-16 max-w-3xl prose-vd">
      <PageTitle eyebrow="Metodologia" tone="accent">{SITE_TEXTS.metodologia.title}</PageTitle>

      {SITE_TEXTS.metodologia.sections.map((sec) => (
        <section key={sec.id}>
          <h2 id={sec.id}>{sec.title}</h2>
          {sec.blocks.map((bl, i) => {
            if (bl.t === "p") return <p key={i}>{rich(fillCounts(bl.text, c))}</p>;
            const items = bl.items.map((it, j) => <li key={j}>{rich(fillCounts(it, c))}</li>);
            return bl.t === "ol" ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
          })}
        </section>
      ))}
    </div>
  );
}
