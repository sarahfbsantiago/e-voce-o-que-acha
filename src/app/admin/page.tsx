import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminHero, AdminShell } from "@/components/admin/AdminUI";
import { Modal } from "@/components/Modal";

export const metadata: Metadata = { title: "Como usar o admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Tip = { id: string; icon: string; title: string; short: string; color: string; points: [string, string][] };

/** Cada tópico: um botão colorido; o detalhe abre num pop-up com tópicos curtos coloridos. */
const TIPS: Tip[] = [
  { id: "secoes", icon: "🧭", title: "As seções", short: "o que tem em cada aba", color: "#6d3fc4", points: [
    ["Dados da pesquisa", "Respostas das pessoas, só em números."],
    ["Revisão de posições", "O que cada candidato defende em cada pergunta, com as fontes."],
    ["Notas por alternativa", "Define, tema a tema, se a pessoa fica mais perto de Lula, de Flávio ou equivalente."],
    ["Espectro político", "Define a ideologia da pessoa na régua."],
    ["Perguntas", "O questionário."],
    ["Textos do site e Fontes", "Tudo de texto e de links do site e do relatório."],
    ["Sugestões", "Ideias de mudança, sem mexer no site."],
    ["Publicar e Histórico", "Aprovar mudanças, ver versões e voltar atrás."],
  ] },
  { id: "onde", icon: "📍", title: "Onde aparece no site", short: "o que muda o quê", color: "#2563eb", points: [
    ["Régua e “sua ideologia”", "vêm do Espectro político."],
    ["Selo Lula / Flávio de cada tema", "vem das Notas por alternativa."],
    ["Questionário e “25 perguntas”", "vêm de Perguntas; as contagens se ajustam sozinhas."],
    ["Perfis, cards das correntes, currículos", "vêm de Textos do site."],
    ["Página Fontes e links das evidências", "vêm de Fontes e links e de Revisão de posições."],
  ] },
  { id: "notas", icon: "★", title: "Mudar uma nota", short: "1, 0,5 ou 0", color: "#2f9a5d", points: [
    ["Abra", "Notas por alternativa."],
    ["Clique", "na nota do candidato e escolha 1, 0,5 ou 0."],
    ["Bolinha laranja", "= mudou e ainda não foi ao ar."],
    ["Logo abaixo", "clique em Enviar para aprovação."],
  ] },
  { id: "faixas", icon: "🎨", title: "Mudar uma faixa", short: "para onde a resposta leva", color: "#0891b2", points: [
    ["Abra", "Espectro político."],
    ["Escolha", "a faixa de cada alternativa (Esquerda … Direita)."],
    ["A pessoa fica", "na média das faixas que marcou."],
    ["Logo abaixo", "Enviar para aprovação."],
  ] },
  { id: "regua", icon: "↔", title: "Mover a régua", short: "correntes, Lula, Flávio, divisa", color: "#ec4899", points: [
    ["Arraste", "as correntes, Lula, Flávio, a linha divisória e as barrinhas pretas dos trechos."],
    ["Teclado", "setas ajustam 0,01; com Shift, 0,1."],
    ["Regras", "correntes não se cruzam; a divisa fica entre Lula e Flávio."],
    ["Depois", "Salvar no rascunho → Enviar para aprovação."],
  ] },
  { id: "perguntas", icon: "≡", title: "Perguntas", short: "criar, editar, arquivar", color: "#d4a017", points: [
    ["Criar", "texto, tema e, em cada alternativa, nota do Lula, nota do Flávio e faixa."],
    ["Editar", "texto, exemplo e alternativas; + Alternativa."],
    ["Arquivar", "sai do questionário; respostas antigas ficam guardadas."],
    ["Cada pergunta", "tem o seu Enviar para aprovação."],
  ] },
  { id: "textos", icon: "¶", title: "Textos e fontes", short: "perfis, correntes, currículos, links", color: "#7c3aed", points: [
    ["Abra", "Textos do site ou Fontes e links."],
    ["Clique", "no item para abrir e editar campos e listas (+ Adicionar, ×)."],
    ["Dica", "**texto** = negrito; {perguntas} e {temas} = contagens."],
    ["Fontes", "teste o link antes de enviar."],
  ] },
  { id: "publicar", icon: "⇪", title: "Aprovar e publicar", short: "como um pull request", color: "#dc2626", points: [
    ["1. Salvar no rascunho", "depois de editar, clique em Salvar no rascunho (notas e faixas salvam sozinhas)."],
    ["2. Enviar para aprovação", "logo abaixo do item: seu nome + o que mudou."],
    ["Mudou de ideia antes de enviar?", "Desfazer este ajuste (volta ao que está no ar) ou Excluir rascunho, em Publicar."],
    ["Depois de enviado", "só dá para cancelar no painel de aprovação (Publicar → pedido → Cancelar meu pedido)."],
    ["3. Revisar", "em Publicar, abra o pedido: o que muda e o impacto."],
    ["4. Aceitar", "veja a prévia de como o site vai ficar."],
    ["5. Confirmar", "nome, motivo, Estou ciente, frase e código do Google Authenticator. O site muda na hora."],
  ] },
  { id: "impacto", icon: "📊", title: "Ler o impacto", short: "quem muda de resultado", color: "#f97316", points: [
    ["Calculado", "com os questionários reais já enviados."],
    ["“Ideologia muda para 14 de 120”", "14 pessoas teriam outra ideologia."],
    ["“Lula na régua 82% → 79%”", "muda a proporção entre os lados."],
    ["“Tema Saúde muda para 6”", "6 pessoas veriam outro candidato nesse tema."],
  ] },
  { id: "historico", icon: "⟲", title: "Histórico e voltar", short: "versões e rollback", color: "#0f766e", points: [
    ["Cada publicação", "vira uma versão: quem, quando, motivo, impacto."],
    ["Comparar", "duas versões e ver as réguas."],
    ["Voltar", "para uma versão vira um pedido, aprovado com frase e código."],
    ["Nada", "é apagado."],
  ] },
  { id: "sugestoes", icon: "✎", title: "Sugestões", short: "propor sem mudar", color: "#6d3fc4", points: [
    ["Registre", "com seu nome, a seção e o que sugere."],
    ["Quem decide", "aceita ou recusa, com comentário."],
    ["Levar para o rascunho", "abre o editor certo."],
  ] },
  { id: "seguranca", icon: "🔒", title: "Segurança", short: "código e sessão", color: "#1c1c1a", points: [
    ["Entrar", "código do Google Authenticator."],
    ["Sessão", "30 minutos (relógio no topo); atualizar ou reabrir pede o código."],
    ["Aprovar", "pede o código de novo; 5 erros bloqueiam por 10 minutos."],
  ] },
  { id: "faq", icon: "?", title: "Dúvidas", short: "mudei e não apareceu…", color: "#2563eb", points: [
    ["Mudei e não apareceu", "ainda está no rascunho ou aguardando aprovação."],
    ["Publiquei errado", "Histórico → Voltar para esta versão."],
    ["Quem já respondeu", "passa a ver o resultado com a versão nova."],
    ["Descartar tudo", "Publicar → Descartar o rascunho."],
  ] },
];

/** Como usar o admin: botões coloridos; cada um abre a explicação num pop-up. */
export default async function Page() {
  if (!(await isAdminSession())) redirect("/admin/login");
  return (
    <AdminShell current="/admin">
      <AdminHero kicker="Comece aqui" title="Como usar o admin" pdfTitle="Como usar o admin" subtitle="Toque num tema para ver o passo a passo." />

      <ol className="flex flex-wrap items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-soft to-[#dbeafe] p-4 text-xs font-bold text-ink ring-1 ring-purple/20 sm:text-sm">
        {["✏️ Editar", "💾 Salvar no rascunho", "📨 Enviar para aprovação", "👀 Revisar e prévia", "🔑 Código", "🚀 No ar", "🗂️ Histórico"].map((t, i, a) => (
          <li key={t} className="flex items-center gap-2"><span className="rounded-xl bg-surface px-3 py-2 shadow-sm ring-1 ring-line">{t}</span>{i < a.length - 1 ? <span className="text-purple">→</span> : null}</li>
        ))}
      </ol>

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {TIPS.map((t) => (
          <li key={t.id} id={t.id} className="scroll-mt-6">
            <Modal plainTrigger title={`${t.icon} ${t.title}`} className="group h-full w-full rounded-2xl bg-surface p-4 text-left shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 hover:shadow-md"
              trigger={
                <span className="flex h-full flex-col gap-2">
                  <span className="grid h-11 w-11 place-items-center rounded-xl text-xl text-white shadow-sm" style={{ background: t.color }}>{t.icon}</span>
                  <span className="text-sm font-bold text-ink">{t.title}</span>
                  <span className="text-xs text-ink-3">{t.short}</span>
                  <span className="mt-auto text-xs font-bold" style={{ color: t.color }}>Ver como →</span>
                </span>
              }>
              <ul className="space-y-2.5">
                {t.points.map(([a, b], i) => (
                  <li key={i} className="flex gap-3 rounded-xl p-3" style={{ background: `${t.color}12` }}>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: t.color }}>{i + 1}</span>
                    <span className="text-sm leading-relaxed text-ink-2"><b style={{ color: t.color }}>{a}</b> {b}</span>
                  </li>
                ))}
              </ul>
            </Modal>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
