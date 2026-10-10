/** Conteúdo do tutorial do admin (tela Como usar e manual em PDF). */
import type { IconName } from "./Icon";

export type Tip = { id: string; icon: IconName; title: string; short: string; color: string; points: [string, string][] };

/** Cada tópico: um botão colorido; o detalhe abre num pop-up com tópicos curtos coloridos. */
export const TIPS: Tip[] = [
  { id: "secoes", icon: "compass", title: "As seções", short: "o que tem em cada aba", color: "#6d3fc4", points: [
    ["Dados da pesquisa", "Respostas das pessoas, só em números."],
    ["Revisão de posições", "O que cada candidato defende em cada pergunta, com as fontes."],
    ["Notas e espectro: notas", "Define, tema a tema, se a pessoa fica mais perto de Lula, de Flávio ou equivalente."],
    ["Notas e espectro: faixas", "Define a ideologia da pessoa na régua."],
    ["Perguntas", "O questionário."],
    ["Textos do site e Fontes", "Tudo de texto e de links do site e do relatório."],
    ["Sugestões", "Ideias de mudança, sem mexer no site."],
    ["Publicar e Histórico", "Aprovar mudanças, ver versões e voltar atrás."],
  ] },
  { id: "onde", icon: "pin", title: "Onde aparece no site", short: "o que muda o quê", color: "#2563eb", points: [
    ["Régua e “sua ideologia”", "vêm das faixas (Notas e espectro) e da Régua do espectro."],
    ["Selo Lula / Flávio de cada tema", "vem das notas (Notas e espectro)."],
    ["Questionário e “25 perguntas”", "vêm de Perguntas; as contagens se ajustam sozinhas."],
    ["Perfis, cards das correntes, currículos", "vêm de Textos do site."],
    ["Página Fontes e links das evidências", "vêm de Fontes e links e de Revisão de posições."],
  ] },
  { id: "notas", icon: "star", title: "Mudar uma nota", short: "1, 0,5 ou 0", color: "#2f9a5d", points: [
    ["Abra", "Notas e espectro."],
    ["Clique", "na nota do candidato e escolha 1, 0,5 ou 0."],
    ["Bolinha laranja", "= mudou e ainda não foi ao ar."],
    ["Logo abaixo", "clique em Enviar para aprovação."],
  ] },
  { id: "faixas", icon: "palette", title: "Mudar uma faixa", short: "para onde a resposta leva", color: "#0891b2", points: [
    ["Abra", "Notas e espectro, coluna Régua."],
    ["Escolha", "a faixa de cada alternativa (Esquerda … Direita)."],
    ["A pessoa fica", "na média das faixas que marcou."],
    ["Logo abaixo", "Enviar para aprovação."],
  ] },
  { id: "regua", icon: "ruler", title: "Mover a régua", short: "correntes, Lula, Flávio, divisa", color: "#ec4899", points: [
    ["Arraste", "as correntes, Lula, Flávio, a linha divisória e as barrinhas pretas dos trechos."],
    ["Teclado", "setas ajustam 0,01; com Shift, 0,1."],
    ["Regras", "correntes não se cruzam; a divisa fica entre Lula e Flávio."],
    ["Depois", "Salvar no rascunho → Enviar para aprovação."],
  ] },
  { id: "perguntas", icon: "list", title: "Perguntas", short: "criar, editar, arquivar", color: "#d4a017", points: [
    ["Criar", "texto, tema e, em cada alternativa, nota do Lula, nota do Flávio e faixa."],
    ["Editar", "texto, exemplo e alternativas; + Alternativa."],
    ["Arquivar", "sai do questionário; respostas antigas ficam guardadas."],
    ["Cada pergunta", "tem o seu Enviar para aprovação."],
  ] },
  { id: "textos", icon: "text", title: "Textos e fontes", short: "perfis, correntes, currículos, links", color: "#7c3aed", points: [
    ["Abra", "Textos do site ou Fontes e links."],
    ["Clique", "no item para abrir e editar campos e listas (+ Adicionar, ×)."],
    ["Dica", "**texto** = negrito; {perguntas} e {temas} = contagens."],
    ["Fontes", "teste o link antes de enviar."],
  ] },
  { id: "publicar", icon: "upload", title: "Aprovar e publicar", short: "como um pull request", color: "#dc2626", points: [
    ["1. Salvar no rascunho", "depois de editar, clique em Salvar no rascunho (notas e faixas salvam sozinhas)."],
    ["2. Enviar para aprovação", "logo abaixo do item: seu nome + o que mudou."],
    ["Mudou de ideia antes de enviar?", "Desfazer este ajuste (volta ao que está no ar) ou Excluir rascunho, em Publicar."],
    ["Depois de enviado", "só dá para cancelar no painel de aprovação (Publicar → pedido → Cancelar meu pedido)."],
    ["3. Revisar", "em Publicar, abra o pedido: o que muda e o impacto."],
    ["4. Aceitar", "veja a prévia de como o site vai ficar."],
    ["5. Confirmar", "nome, motivo, Estou ciente, frase e código do Google Authenticator. O site muda na hora."],
  ] },
  { id: "impacto", icon: "chart", title: "Ler o impacto", short: "quem muda de resultado", color: "#f97316", points: [
    ["Calculado", "com os questionários reais já enviados."],
    ["“Ideologia muda para 14 de 120”", "14 pessoas teriam outra ideologia."],
    ["“Lula na régua 82% → 79%”", "muda a proporção entre os lados."],
    ["“Tema Saúde muda para 6”", "6 pessoas veriam outro candidato nesse tema."],
  ] },
  { id: "historico", icon: "history", title: "Histórico e voltar", short: "versões e rollback", color: "#0f766e", points: [
    ["Cada publicação", "vira uma versão: quem, quando, motivo, impacto."],
    ["Comparar", "duas versões e ver as réguas."],
    ["Voltar", "para uma versão vira um pedido, aprovado com frase e código."],
    ["Nada", "é apagado."],
  ] },
  { id: "sugestoes", icon: "pencil", title: "Sugestões", short: "propor sem mudar", color: "#6d3fc4", points: [
    ["Registre", "com seu nome, a seção e o que sugere."],
    ["Quem decide", "aceita ou recusa, com comentário."],
    ["Levar para o rascunho", "abre o editor certo."],
  ] },
  { id: "seguranca", icon: "lock", title: "Segurança", short: "código e sessão", color: "#1c1c1a", points: [
    ["Entrar", "código do Google Authenticator."],
    ["Sessão", "30 minutos (relógio no topo); atualizar ou reabrir pede o código."],
    ["Aprovar", "pede o código de novo; 5 erros bloqueiam por 10 minutos."],
  ] },
  { id: "faq", icon: "help", title: "Dúvidas", short: "mudei e não apareceu…", color: "#2563eb", points: [
    ["Mudei e não apareceu", "ainda está no rascunho ou aguardando aprovação."],
    ["Publiquei errado", "Histórico → Voltar para esta versão."],
    ["Quem já respondeu", "passa a ver o resultado com a versão nova."],
    ["Descartar tudo", "Publicar → Descartar o rascunho."],
  ] },
];

export const AUTH_STEPS: [string, string][] = [
  ["Instale", "o Google Authenticator no celular (App Store ou Google Play)."],
  ["Toque em +", "e escolha “Inserir chave de configuração”."],
  ["Nome da conta", "E Você, O Que Acha? (admin)."],
  ["Chave", "copie a chave em Como usar → Registrar no Google Authenticator (toque no olhinho para ver) e cole no aplicativo."],
  ["Tipo de chave", "“Baseada no tempo”. Salve."],
  ["Pronto", "o código de 6 números muda a cada 30 segundos; use-o para entrar e para aprovar."],
];
