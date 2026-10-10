import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";
import { ConsentForm } from "@/components/ConsentForm";
import { QUESTIONS } from "@/data/questions";
import { ensureLiveConfig } from "@/lib/live-config-server";
import { TOPICS } from "@/data/topics";

export const metadata: Metadata = { title: "Antes de começar" };

export default async function QuestionarioIntroPage() {
  await ensureLiveConfig();
  return (
    <div className="container-page py-7 md:py-16 max-w-3xl">
      <PageTitle eyebrow="Questionário" lead={`${QUESTIONS.length} perguntas em ${TOPICS.length} temas. Você pode parar e voltar depois: as respostas ficam no seu navegador.`}>
        Antes de começar
      </PageTitle>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Nomes ocultos", "Os candidatos não aparecem durante as perguntas, para reduzir influência partidária.", "border-t-accent"],
          ["Sem cor partidária", "Nenhuma cor de partido é usada durante a coleta das respostas.", "border-t-purple"],
          ["Compare no final", "Depois, você vê suas respostas ao lado das informações documentadas de cada candidatura.", "border-t-mint"],
        ].map(([title, text, tone], i) => (
          <section key={title} className={`card animate-fade-up p-5 border-t-4 shadow-sm ${tone}`} style={{ animationDelay: `${100 + i * 90}ms` }}>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1.5 text-sm text-ink-2 leading-relaxed">{text}</p>
          </section>
        ))}
      </div>

      <ConsentForm />
    </div>
  );
}
