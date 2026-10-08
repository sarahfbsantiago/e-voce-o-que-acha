import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";
import { StartButton } from "@/components/StartButton";

export const metadata: Metadata = { title: "Como funciona" };

const STEPS: [string, string][] = [
  ["Você responde", "25 perguntas em linguagem simples sobre políticas públicas e valores políticos, divididas em 5 seções com 12 temas. Cada seção começa perguntando o quanto aqueles temas importam para você. Toda pergunta tem a opção “Não sei”. Os nomes dos candidatos ficam ocultos durante as perguntas, e nenhuma cor partidária é usada."],
  ["Você declara prioridades", "Ao final de cada sessão, você informa quanto aquele tema importa para você. Essa informação serve exclusivamente para ordenar o seu relatório."],
  ["Nós organizamos as evidências", "Para cada pergunta, comparamos sua resposta com a posição documentada de cada candidato: igual, parecida ou diferente. Se o candidato não se posicionou nas fontes oficiais, a pergunta conta como diferente para ele, e o site diz isso. Depois, você conhece melhor os candidatos: trajetória, cargos, o que fizeram e o que prometem, com link para cada documento."],
  ["Você consulta o histórico", "Atuação legislativa e políticas executadas são apresentadas conforme o cargo que o candidato ocupou. Um parlamentar não é penalizado por não ter competências executivas."],
  ["Você vê a diferença", "Proposta eleitoral, declaração, atuação legislativa, política executada e indicador estatístico são sempre separados e nunca misturados."],
  ["Você abre a fonte", "Cada afirmação sobre um candidato aponta para o documento original. No relatório, cada pergunta mostra qual documento sustenta a posição, com data e link. Na trajetória, o botão “Como sabemos disso?” mostra a fonte, a instituição, o trecho utilizado e o tipo de evidência. O catálogo de fontes abre a origem de cada uma."],
  ["Você entende o sistema", "A metodologia é pública: perguntas, critérios de inclusão e exclusão, hierarquia de evidências, tratamento de lacunas e histórico de alterações."],
  ["Você decide", "O site não recomenda candidato nem monta ranking. Mostra, com a conta aberta, quanto suas respostas concordam com cada um e em quantos temas cada um ficou mais perto. A decisão é sua."],
];

const TONES = ["bg-accent", "bg-purple", "bg-mint", "bg-gold"];

export default function ComoFuncionaPage() {
  return (
    <div className="container-page py-7 md:py-16 max-w-3xl">
      <PageTitle eyebrow="Passo a passo" lead="Oito passos, sem recomendação de voto e com a conta aberta.">Como funciona</PageTitle>

      <ol className="space-y-4">
        {STEPS.map(([title, text], i) => (
          <li key={i} className="card card-lift animate-fade-up p-5 md:p-6 flex gap-4 shadow-sm" style={{ animationDelay: `${120 + i * 70}ms` }}>
            <span aria-hidden="true" className={`h-10 w-10 shrink-0 rounded-xl text-white grid place-items-center font-bold ${TONES[i % TONES.length]}`}>{i + 1}</span>
            <div>
              <h2 className="font-semibold text-lg leading-snug">{title}</h2>
              <p className="mt-1.5 text-sm text-ink-2 leading-relaxed">{text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <section className="card p-6 border-t-4 border-t-accent shadow-sm">
          <h2 className="font-semibold text-lg">O que os indicadores significam</h2>
          <p className="mt-2 text-sm text-ink-2">No relatório, ao abrir uma das cinco áreas, cada pergunta que você respondeu mostra, para cada candidato, um destes indicadores. No fim, o relatório mostra a proporção de iguais e parecidas por candidato e em quantos temas cada um ficou mais perto, com a fórmula à vista. Nada vira nota.</p>
        </section>
        <section className="card p-6 border-t-4 border-t-purple shadow-sm">
          <h2 className="font-semibold text-lg">O que o site nunca faz</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              "Não calcula “melhor candidato” nem recomenda voto: as porcentagens do relatório são concordância com documentos publicados, com a conta aberta.",
              "Não recomenda voto.",
              "Não atribui automaticamente a um governante a causa de mudanças estatísticas observadas durante seu mandato.",
              "Não atribui a um candidato posições de partido, familiares, aliados ou apoiadores.",
              "Não preenche lacunas com inferências ideológicas: quando falta evidência, diz que falta e conta a pergunta como diferente, para que o silêncio não beneficie ninguém.",
            ].map((t) => (
              <li key={t} className="flex gap-2"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple" />{t}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-12 flex justify-center">
        <StartButton className="btn-cta min-h-12 rounded-2xl px-8 text-base sm:min-h-14 sm:px-10 sm:text-lg" />
      </div>
    </div>
  );
}
