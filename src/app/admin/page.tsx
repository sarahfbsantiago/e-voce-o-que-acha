import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminHero, AdminShell } from "@/components/admin/AdminUI";
import { SPECTRUM_BANDS } from "@/data/political-spectrum";

export const metadata: Metadata = { title: "Como usar o admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const STEP = "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-purple to-[#2563eb] text-sm font-bold text-white";

function Card({ id, n, title, children, color = "#6d3fc4" }: { id: string; n: number; title: string; children: ReactNode; color?: string }) {
  return (
    <section id={id} className="scroll-mt-6 overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-black/5 print:break-inside-avoid">
      <div aria-hidden="true" className="h-1.5" style={{ background: color }} />
      <div className="p-5">
        <h2 className="flex items-center gap-3 text-lg font-bold text-ink"><span className={STEP}>{n}</span>{title}</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-2">{children}</div>
      </div>
    </section>
  );
}
const Do = ({ children }: { children: ReactNode }) => <li className="flex gap-2"><span aria-hidden="true" className="mt-0.5 text-purple">▸</span><span>{children}</span></li>;
const Pill = ({ c, children }: { c: string; children: ReactNode }) => <span className={`inline-grid h-6 min-w-9 place-items-center rounded-full px-2 text-xs font-bold ${c}`}>{children}</span>;

/** Tutorial do admin: o que é cada seção, onde aparece no site e como mudar, publicar e voltar versões. */
export default async function Page() {
  if (!(await isAdminSession())) redirect("/admin/login");
  const toc: [string, string][] = [["secoes", "As seções"], ["onde", "Onde aparece no site"], ["notas", "Mudar uma nota"], ["faixas", "Mudar uma faixa"], ["regua", "Mover a régua"], ["perguntas", "Perguntas"], ["publicar", "Publicar"], ["impacto", "Ler o impacto"], ["historico", "Histórico e rollback"], ["sugestoes", "Sugestões"], ["seguranca", "Segurança"], ["faq", "Dúvidas"]];

  return (
    <AdminShell current="/admin">
      <AdminHero kicker="Comece aqui" title="Como usar o admin" pdfTitle="Como usar o admin"
        subtitle="Tudo o que muda a conta do site você faz por aqui: notas, faixas, régua e perguntas. Nada vai para o site sem passar por Publicar, e tudo fica no Histórico." />

      <nav aria-label="Tutorial" className="flex flex-wrap gap-2 rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-black/5 print:hidden">
        {toc.map(([id, l], i) => <a key={id} href={`#${id}`} className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink-2 ring-1 ring-line hover:bg-purple-soft hover:text-purple-strong">{i + 1}. {l}</a>)}
      </nav>

      <div className="rounded-2xl bg-gradient-to-r from-purple-soft to-[#dbeafe] p-5 ring-1 ring-purple/20">
        <p className="text-sm font-bold uppercase tracking-wide text-purple-strong">O caminho de toda mudança</p>
        <ol className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
          {["Edite (vai para o rascunho)", "Revise em Publicar", "Veja o impacto", "Nome, motivo, frase e código", "Publicar", "Fica no Histórico"].map((t, i, a) => (
            <li key={t} className="flex items-center gap-2"><span className="rounded-xl bg-surface px-3 py-2 shadow-sm ring-1 ring-line">{t}</span>{i < a.length - 1 ? <span className="text-purple">→</span> : null}</li>
          ))}
        </ol>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card id="secoes" n={1} title="O que é cada seção">
          <ul className="space-y-2">
            <Do><b className="text-ink">Dados da pesquisa:</b> o que as pessoas responderam, só em números agregados.</Do>
            <Do><b className="text-ink">Revisão de posições:</b> a posição documentada de cada candidato em cada pergunta, com as fontes.</Do>
            <Do><b className="text-ink">Notas por alternativa</b> (análise específica): define, tema a tema, se a pessoa fica mais perto de Lula, de Flávio ou equivalente.</Do>
            <Do><b className="text-ink">Espectro político</b> (análise geral): define a ideologia da pessoa na régua e de qual candidato ela fica mais perto ideologicamente.</Do>
            <Do><b className="text-ink">Perguntas:</b> o questionário.</Do>
            <Do><b className="text-ink">Sugestões:</b> ideias de mudança registradas, sem mexer no site.</Do>
            <Do><b className="text-ink">Publicar</b> e <b className="text-ink">Histórico:</b> levar o rascunho ao site, e ver ou voltar versões.</Do>
          </ul>
        </Card>

        <Card id="onde" n={2} title="Onde cada coisa aparece no site" color="#2563eb">
          <div className="rounded-xl bg-paper/70 p-3 ring-1 ring-line">
            <p className="text-xs font-bold text-ink">Relatório da pessoa</p>
            <div className="relative mt-2 rounded-lg bg-surface p-2 ring-1 ring-line"><span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-[#ec4899] text-xs font-bold text-white">A</span><p className="text-xs font-semibold">Sua ideologia: Progressismo</p><div className="mt-1 flex h-2 overflow-hidden rounded-full">{SPECTRUM_BANDS.map((b) => <span key={b.label} className="flex-1" style={{ background: b.color }} />)}</div></div>
            <div className="relative mt-2 rounded-lg bg-surface p-2 ring-1 ring-line"><span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-[#6d3fc4] text-xs font-bold text-white">B</span><p className="flex justify-between text-xs">Economia e impostos <span className="rounded bg-accent-soft px-1.5 text-[11px] text-accent-strong">Lula</span></p></div>
          </div>
          <ul className="space-y-1.5">
            <Do><b className="text-[#ec4899]">A</b>: ideologia, régua e &quot;sua ideologia está mais próxima de…&quot; vêm do <b className="text-ink">Espectro político</b> (faixas e régua).</Do>
            <Do><b className="text-[#6d3fc4]">B</b>: o selo Lula, Flávio ou equivalente de cada tema e a contagem de temas vêm das <b className="text-ink">Notas por alternativa</b>.</Do>
            <Do>As <b className="text-ink">Perguntas</b> aparecem no questionário, e a contagem (&quot;25 perguntas&quot;, &quot;12 temas&quot;) se ajusta sozinha.</Do>
          </ul>
        </Card>

        <Card id="notas" n={3} title="Como mudar uma nota" color="#6d3fc4">
          <ol className="space-y-2">
            <Do>Abra <Link href="/admin/notas" className="font-semibold text-purple underline">Notas por alternativa</Link>.</Do>
            <Do>Na pergunta, clique na nota do candidato e escolha <Pill c="bg-mint text-white">1</Pill> <Pill c="bg-gold text-[#3d2f05]">0,5</Pill> ou <Pill c="bg-line text-ink-2">0</Pill>.</Do>
            <Do>Salva sozinho no rascunho. A bolinha <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#f97316] align-middle" /> laranja mostra o que mudou e ainda não foi ao ar.</Do>
          </ol>
        </Card>

        <Card id="faixas" n={4} title="Como mudar a faixa de uma alternativa" color="#2563eb">
          <ol className="space-y-2">
            <Do>Abra <Link href="/admin/espectro" className="font-semibold text-purple underline">Espectro político</Link>.</Do>
            <Do>Em cada alternativa, escolha na lista a faixa da régua (Extrema esquerda … Extrema direita).</Do>
            <Do>A posição da pessoa é a média do meio das faixas que ela marcou.</Do>
          </ol>
        </Card>

        <Card id="regua" n={5} title="Como mover a régua" color="#ec4899">
          <ul className="space-y-2">
            <Do>Em <Link href="/admin/espectro" className="font-semibold text-purple underline">Espectro político</Link>, painel <b className="text-ink">Editar a régua</b>.</Do>
            <Do>Arraste as <b className="text-ink">correntes</b> (Comunismo, Progressismo…), <b className="text-ink">Lula</b>, <b className="text-ink">Flávio</b>, a <b className="text-ink">linha divisória</b> e as barrinhas pretas dos <b className="text-ink">trechos das ideologias</b>. No teclado: setas (0,01) e Shift + setas (0,1).</Do>
            <Do>Regras: as correntes não se cruzam, cada seta fica dentro do seu trecho, e a linha divisória fica entre Lula e Flávio. Se algo quebrar, aparece em vermelho.</Do>
            <Do>Clique em <b className="text-ink">Salvar no rascunho</b>.</Do>
          </ul>
        </Card>

        <Card id="perguntas" n={6} title="Perguntas: criar, editar e arquivar" color="#2f9a5d">
          <ul className="space-y-2">
            <Do><b className="text-ink">Criar:</b> em <Link href="/admin/perguntas" className="font-semibold text-purple underline">Perguntas</Link> → Nova pergunta: tema, texto, exemplo e, em cada alternativa, a <b className="text-ink">nota do Lula</b>, a <b className="text-ink">nota do Flávio</b> e a <b className="text-ink">faixa</b>. &quot;Não sei&quot; entra sozinho.</Do>
            <Do><b className="text-ink">Editar:</b> botão Editar (texto, exemplo, nome das alternativas) ou + Alternativa.</Do>
            <Do><b className="text-ink">Arquivar:</b> a pergunta sai do questionário e da conta; as respostas antigas ficam guardadas. Dá para restaurar.</Do>
          </ul>
        </Card>

        <Card id="publicar" n={7} title="Como publicar" color="#dc2626">
          <ol className="space-y-2">
            <Do>Clique na faixa laranja &quot;mudanças no rascunho&quot; ou em <Link href="/admin/publicar" className="font-semibold text-purple underline">Publicar</Link>.</Do>
            <Do>Confira <b className="text-ink">o que muda</b>, o <b className="text-ink">impacto</b> e a <b className="text-ink">pré-visualização</b>.</Do>
            <Do>Preencha <b className="text-ink">seu nome</b> e o <b className="text-ink">motivo</b>, marque <b className="text-ink">Estou ciente</b>, digite a <b className="text-ink">frase</b> mostrada (ex.: <code className="rounded bg-[#fde8e8] px-1 text-[#9b1c1c]">atualizar notas</code>) e o <b className="text-ink">código do Google Authenticator</b>.</Do>
            <Do>Publicar: o site muda na hora, sem esperar nada.</Do>
          </ol>
        </Card>

        <Card id="impacto" n={8} title="Como ler o impacto" color="#f97316">
          <ul className="space-y-2">
            <Do>O impacto é calculado com os <b className="text-ink">questionários reais</b> já enviados, antes e depois da mudança.</Do>
            <Do>&quot;Ideologia muda para 14 de 120&quot;: 14 pessoas passariam a ter outra ideologia no relatório.</Do>
            <Do>&quot;Mais perto de Lula na régua 82% → 79%&quot;: muda a proporção entre os dois lados.</Do>
            <Do>&quot;Tema Saúde muda para 6&quot;: 6 pessoas veriam outro candidato mais perto nesse tema.</Do>
          </ul>
        </Card>

        <Card id="historico" n={9} title="Histórico e rollback" color="#2f9a5d">
          <ul className="space-y-2">
            <Do>Cada publicação vira uma <b className="text-ink">versão</b> (v1, v2…) com quem, quando, o motivo, as mudanças e o impacto. Nada pode ser apagado.</Do>
            <Do><b className="text-ink">Comparar:</b> abra uma versão e escolha outra para ver as diferenças e as duas réguas.</Do>
            <Do><b className="text-ink">Voltar para esta versão:</b> passa pela mesma confirmação (frase <code className="rounded bg-[#fde8e8] px-1 text-[#9b1c1c]">voltar para v3</code>) e cria uma versão nova igual à antiga.</Do>
          </ul>
        </Card>

        <Card id="sugestoes" n={10} title="Sugestões" color="#6d3fc4">
          <ul className="space-y-2">
            <Do>Para propor sem mudar: <Link href="/admin/sugestoes" className="font-semibold text-purple underline">Sugestões</Link>, com seu nome, a seção e o que sugere.</Do>
            <Do>Quem decide marca <b className="text-ink">Aceitar</b> ou <b className="text-ink">Recusar</b>, com comentário. &quot;Levar para o rascunho&quot; abre o editor certo.</Do>
          </ul>
        </Card>

        <Card id="seguranca" n={11} title="Segurança" color="#1c1c1a">
          <ul className="space-y-2">
            <Do>Entrar pede o código do Google Authenticator. A sessão dura <b className="text-ink">30 minutos</b> (relógio no topo); atualizar ou reabrir a página pede o código de novo.</Do>
            <Do>Publicar e voltar versão pedem o código outra vez. 5 erros bloqueiam por 10 minutos.</Do>
            <Do>Perdeu o celular? Peça uma chave nova do autenticador.</Do>
          </ul>
        </Card>

        <Card id="faq" n={12} title="Dúvidas comuns" color="#2563eb">
          <ul className="space-y-2">
            <Do><b className="text-ink">Mudei e não apareceu no site.</b> Ainda está no rascunho: vá em Publicar.</Do>
            <Do><b className="text-ink">Publiquei errado.</b> Histórico → a versão anterior → Voltar para esta versão.</Do>
            <Do><b className="text-ink">E quem já respondeu?</b> O relatório e o painel passam a usar a versão nova. O impacto mostra quantas pessoas mudam.</Do>
            <Do><b className="text-ink">Quero descartar tudo do rascunho.</b> Publicar → Descartar o rascunho.</Do>
          </ul>
        </Card>
      </div>
    </AdminShell>
  );
}
