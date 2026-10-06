import { BrazilMark } from "@/components/brand/BrazilMark";
import { TypewriterTitle } from "@/components/TypewriterTitle";
import { CountUp } from "@/components/fx/CountUp";
import { ButtonLink } from "@/components/ui";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { CORE_PRINCIPLE } from "@/domain/neutrality";

const STATS = [
  { value: String(QUESTIONS.length), label: `perguntas sobre políticas públicas e valores, em ${TOPICS.length} temas`, tone: "text-accent", bar: "from-accent to-purple-soft" },
  { value: "0", label: "recomendações de voto ou ranking de candidatos", tone: "text-purple-strong", bar: "from-purple to-purple-soft" },
  { value: "100%", label: "das afirmações sobre candidatos com fonte original consultável", tone: "text-mint-strong", bar: "from-mint to-mint-soft" },
];

const IconInfo = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-purple" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="10" cy="10" r="7.5" /><path d="M10 9v5M10 6.5v.2" strokeLinecap="round" />
  </svg>
);
const IconBook = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-gold-strong" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 4.5h5.5a2 2 0 0 1 2 2V16a1.5 1.5 0 0 0-1.5-1.5H3zM17 4.5h-5.5a2 2 0 0 0-2 2V16a1.5 1.5 0 0 1 1.5-1.5H17z" strokeLinejoin="round" />
  </svg>
);
const IconLink = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-mint" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M8.5 11.5l3-3M7 13l-1.2 1.2a2.5 2.5 0 0 1-3.5-3.5L5 8M13 7l1.2-1.2a2.5 2.5 0 0 1 3.5 3.5L15 12" strokeLinecap="round" />
  </svg>
);

export default function HomePage() {
  return (
    <div className="relative">

      <div className="container-page py-8 md:py-20">
        <section className="mx-auto max-w-3xl text-center">
          <p className="animate-fade-up mx-auto inline-flex max-w-full items-center gap-2 rounded-full border border-purple/30 bg-purple-soft px-4 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-purple-strong">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-purple" />
            {CORE_PRINCIPLE}
          </p>

          <TypewriterTitle
            text="Você decide"
            className="animate-fade-up [animation-delay:120ms] mt-4 text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          />

          <div className="animate-fade-up [animation-delay:260ms] mt-8 flex justify-center">
            <ButtonLink
              href="/questionario"
              className="btn-cta w-full max-w-sm min-h-14 rounded-2xl px-8 text-lg font-bold tracking-tight sm:min-h-16 sm:w-auto sm:px-12 sm:text-xl md:min-h-[4.5rem] md:text-2xl"
            >
              Começar
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </ButtonLink>
          </div>

          {/* âncora: o mapa em pontilhismo se forma aqui; com movimento reduzido mostra a marca estática */}
          <div className="animate-fade-up [animation-delay:380ms] mt-10 flex justify-center">
            <div id="mapa-anchor" className="relative h-[226px] w-[220px]">
              <BrazilMark size={220} className="hidden motion-reduce:block" />
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:500ms] card mx-auto mt-8 max-w-2xl border-t-4 border-t-accent px-5 py-6 shadow-sm md:px-10 md:py-9">
            <p className="text-lg sm:text-xl text-ink-2">
              Compare suas prioridades com propostas e registros públicos dos candidatos.
            </p>
            <div className="mt-5 space-y-3 border-t border-line pt-5 text-base sm:text-lg text-ink-2 leading-relaxed">
              <p className="font-semibold text-ink">Este site não diz em quem você deve votar.</p>
              <p>
                Você responde a perguntas sobre temas concretos e, em seguida, pode consultar propostas, posicionamentos,
                atos políticos e dados públicos relacionados aos mesmos assuntos.
              </p>
              <p>Todas as fontes utilizadas são apresentadas para consulta.</p>
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:640ms] mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/como-funciona" variant="secondary"><IconInfo />Como funciona</ButtonLink>
            <ButtonLink href="/metodologia" variant="secondary"><IconBook />Ver metodologia</ButtonLink>
            <ButtonLink href="/fontes" variant="secondary"><IconLink />Consultar fontes</ButtonLink>
          </div>
        </section>

        <section className="mx-auto mt-12 sm:mt-20 grid max-w-4xl gap-4 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="card card-lift animate-fade-up relative overflow-hidden p-6 text-center shadow-sm"
              style={{ animationDelay: `${800 + i * 120}ms` }}
            >
              <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${s.bar}`} />
              <p className={`text-3xl sm:text-4xl font-bold ${s.tone}`}><CountUp value={s.value} /></p>
              <p className="mt-2 text-sm text-ink-2">{s.label}</p>
            </div>
          ))}
        </section>

        <section className="animate-fade-up [animation-delay:1200ms] card mx-auto mt-12 sm:mt-20 max-w-3xl px-5 py-6 shadow-sm md:px-10 md:py-8 prose-vd">
          <h2 className="!mt-0 text-center">O que você recebe ao final</h2>
          <ul>
            <li><strong className="text-accent">Seu mapa de prioridades:</strong> seus temas na ordem de importância que você declarou.</li>
            <li><strong className="text-purple-strong">Comparação por questão:</strong> sua resposta ao lado do que cada candidato propõe, defende ou fez, com a fonte de cada afirmação.</li>
            <li><strong className="text-mint-strong">Trajetória e propostas:</strong> o que cada candidato fez e promete, por tema, com link para a lei, o projeto ou o programa registrado no TSE.</li>
            <li><strong className="text-gold-strong">A conta aberta:</strong> quanto suas respostas concordam com cada candidato e em quantos temas cada um ficou mais perto, com a fórmula à vista. Sem nota, sem ranking, sem recomendação.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
