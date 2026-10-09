/**
 * Textos do espectro político (revisão humana da responsável, 09/10/2026), mantidos como ela escreveu.
 * Cada termo da régua abre a seção correspondente; "Entenda o espectro" abre a introdução, a comparação e as correções.
 */
export type SpectrumBlock =
  | { t: "p"; lead?: string; text: string }
  | { t: "h"; text: string }
  | { t: "ol"; items: string[] }
  | { t: "ul"; items: string[] }
  | { t: "link"; label: string; href: string }
  | { t: "table"; head: [string, string]; rows: [string, string][] };

export interface SpectrumSection { id: string; title: string; blocks: SpectrumBlock[] }

/** Termos na régua: posição de 0 a 8 (meio da faixa = n,5), lado (acima/abaixo) e a seção que explicam. */
export const SPECTRUM_TERMS: { label: string; at: number; side: "above" | "below"; section: string }[] = [
  { label: "Comunismo", at: 0.5, side: "above", section: "comunismo" },
  { label: "Socialismo", at: 1.5, side: "above", section: "socialismo" },
  { label: "Social-democracia", at: 2.5, side: "above", section: "centro-esquerda" },
  { label: "Progressismo", at: 3, side: "below", section: "progressismo" },
  { label: "Centro político", at: 3.5, side: "above", section: "centro" },
  { label: "Liberalismo social", at: 4.5, side: "above", section: "centro-direita" },
  { label: "Libertarianismo", at: 4.5, side: "below", section: "centro-direita" },
  { label: "Liberalismo econômico", at: 5.5, side: "above", section: "direita" },
  { label: "Conservadorismo", at: 5.5, side: "below", section: "direita" },
  { label: "Nacionalismo radical", at: 6.5, side: "above", section: "direita-radical" },
  { label: "Fascismo", at: 7.5, side: "above", section: "fascismo" },
];

export const SPECTRUM_INTRO: SpectrumBlock[] = [
  { t: "p", text: "O espectro político representa diferentes formas de pensar como uma sociedade deve funcionar, quem deve controlar a economia, como a riqueza deve ser distribuída e qual deve ser o papel do Estado na vida das pessoas." },
  { t: "p", text: "Vou explicar cada posição com exemplos práticos, pensando no Brasil, e mostrar como cada corrente poderia responder ao mesmo problema." },
  { t: "p", text: "Uma ressalva: a régua que construímos é didática. Comunismo, socialismo e liberalismo são doutrinas econômicas e políticas, enquanto progressismo, conservadorismo e nacionalismo também podem atravessar diferentes posições." },
];

export const SPECTRUM_SECTIONS: SpectrumSection[] = [
  { id: "comunismo", title: "Extrema esquerda: Comunismo", blocks: [
    { t: "p", lead: "Ideia central:", text: "superar o capitalismo e a divisão da sociedade em classes econômicas." },
    { t: "p", text: "O comunismo, na tradição marxista, propõe uma sociedade na qual os meios de produção, como grandes indústrias e infraestrutura produtiva, não sejam propriedade de uma classe capitalista. Seu horizonte teórico é uma sociedade sem classes e sem Estado coercitivo." },
    { t: "h", text: "Exemplos práticos" },
    { t: "ol", items: [
      "Uma grande fábrica deixaria de pertencer a acionistas privados e passaria a funcionar sob propriedade coletiva ou social.",
      "A produção poderia ser planejada conforme necessidades sociais, em vez de depender principalmente do lucro.",
      "Saúde, educação e moradia seriam organizadas como direitos garantidos coletivamente.",
    ] },
    { t: "p", lead: "Exemplo histórico:", text: "A União Soviética adotou uma economia amplamente planificada e propriedade estatal de grande parte da produção. Porém, seu sistema de partido único e Estado centralizado não correspondeu ao ideal marxista de uma sociedade sem Estado." },
    { t: "p", lead: "Diferença fundamental:", text: "comunismo não significa simplesmente aumentar impostos sobre os ricos. Ele propõe transformar estruturalmente as relações de propriedade e produção." },
  ] },
  { id: "socialismo", title: "Esquerda: Socialismo", blocks: [
    { t: "p", lead: "Ideia central:", text: "colocar a produção e a riqueza econômica sob maior controle social e democrático." },
    { t: "p", text: "O socialismo possui diferentes correntes. Algumas defendem substituir integralmente o capitalismo. Outras aceitam mecanismos de mercado, desde que exista propriedade social ou controle democrático de setores relevantes." },
    { t: "h", text: "Exemplos práticos" },
    { t: "ol", items: [
      "Incentivar cooperativas nas quais os próprios trabalhadores sejam donos da empresa.",
      "Defender controle público ou social de setores estratégicos, como energia e transportes.",
      "Ampliar a participação dos trabalhadores nas decisões empresariais.",
      "Utilizar a política econômica para reduzir desigualdades estruturais.",
    ] },
    { t: "p", lead: "Exemplo concreto:", text: "imagine uma empresa com 100 funcionários. Em uma cooperativa socialista, os trabalhadores poderiam participar das decisões e da distribuição dos resultados, em vez de essas decisões ficarem exclusivamente com proprietários e acionistas." },
    { t: "p", lead: "Diferença para o comunismo:", text: "o socialismo reúne um conjunto mais amplo de propostas. Nem todas exigem abolir completamente os mercados ou o Estado." },
  ] },
  { id: "centro-esquerda", title: "Centro-esquerda: Socialismo democrático e social-democracia", blocks: [
    { t: "p", lead: "Ideia central:", text: "reduzir as desigualdades por meio de instituições democráticas, direitos sociais e participação econômica." },
    { t: "p", text: "Embora frequentemente apareçam próximos, socialismo democrático e social democracia não são sinônimos." },
    { t: "p", lead: "Socialismo democrático:", text: "pretende alcançar uma economia socialista por meios democráticos, com eleições, pluralismo e participação popular." },
    { t: "p", lead: "Social democracia:", text: "na forma contemporânea predominante, aceita a economia capitalista, mas defende regulação, serviços públicos e redistribuição de renda." },
    { t: "h", text: "Exemplos práticos" },
    { t: "ol", items: [
      "Cobrar impostos progressivos, com alíquotas maiores para rendimentos mais altos.",
      "Garantir saúde e educação públicas.",
      "Financiar benefícios sociais e políticas de combate à pobreza.",
      "Fortalecer sindicatos e direitos trabalhistas.",
      "Regular empresas para proteger consumidores e trabalhadores.",
    ] },
    { t: "p", lead: "Exemplo histórico:", text: "a Suécia desenvolveu um amplo Estado de bem estar social, financiado por impostos e combinado com empresas privadas e economia de mercado." },
    { t: "p", text: "Imagine uma pessoa com renda baixa e outra com renda muito alta. Uma política social democrata poderia cobrar proporcionalmente mais da segunda para financiar hospitais, escolas e serviços utilizados pela população." },
    { t: "p", lead: "Diferença importante:", text: "a social democracia procura tornar o capitalismo mais igualitário. O socialismo democrático geralmente pretende ir além dele." },
  ] },
  { id: "progressismo", title: "Entre centro-esquerda e centro: Progressismo", blocks: [
    { t: "p", lead: "Ideia central:", text: "promover mudanças sociais, ampliar direitos e enfrentar formas de discriminação e exclusão." },
    { t: "p", text: "Na nossa régua ilustrativa, colocamos o progressismo entre centro esquerda e centro. Entretanto, ele não está restrito a essa posição, porque trata principalmente de mudanças sociais e culturais, podendo coexistir com diferentes modelos econômicos." },
    { t: "h", text: "Exemplos práticos" },
    { t: "ol", items: [
      "Defender igualdade salarial entre homens e mulheres que realizam trabalho equivalente.",
      "Apoiar o reconhecimento legal de famílias homoafetivas.",
      "Ampliar políticas de inclusão para pessoas com deficiência.",
      "Combater discriminação racial e desigualdade de oportunidades.",
      "Defender a atualização de leis quando normas antigas deixam determinados grupos sem proteção.",
    ] },
    { t: "p", lead: "Exemplo concreto:", text: "um progressista poderia defender que casais homoafetivos tenham os mesmos direitos civis dos demais casais, independentemente de sua religião ou da tradição histórica." },
    { t: "p", text: "Um progressista pode também defender empresas privadas e livre mercado. Isso demonstra por que progressismo e socialismo são conceitos diferentes." },
  ] },
  { id: "centro", title: "Centro: Centrismo político", blocks: [
    { t: "p", lead: "Ideia central:", text: "buscar soluções por meio de negociação, equilíbrio institucional e combinação de propostas." },
    { t: "p", text: "O centro político não representa necessariamente neutralidade. Pode envolver posições próprias e preferências claras por reformas graduais." },
    { t: "h", text: "Exemplos práticos" },
    { t: "ol", items: [
      "Defender o SUS e, simultaneamente, incentivar investimentos privados na saúde.",
      "Manter direitos trabalhistas, aceitando mudanças específicas nas regras de contratação.",
      "Apoiar programas sociais acompanhados de metas fiscais.",
      "Negociar soluções entre grupos com posições econômicas diferentes.",
    ] },
    { t: "p", lead: "Exemplo concreto:", text: "diante de uma proposta de privatização, um centrista poderia rejeitar tanto a privatização integral quanto a manutenção do modelo atual e propor uma parceria entre Estado e setor privado." },
    { t: "p", lead: "Diferença importante:", text: "ser de centro não significa concordar parcialmente com todas as propostas. O centro também pode ter princípios ideológicos definidos." },
  ] },
  { id: "centro-direita", title: "Centro-direita: Liberalismo social e libertarianismo", blocks: [
    { t: "p", lead: "Ideia central:", text: "valorizar as liberdades individuais e a economia de mercado, embora as duas correntes defendam papéis diferentes para o Estado." },
    { t: "h", text: "Liberalismo social" },
    { t: "p", text: "Defende a economia de mercado, os direitos individuais e a atuação do Estado para garantir oportunidades e condições mínimas de vida." },
    { t: "ol", items: [
      "Permitir que empresas privadas atuem na saúde, mantendo serviços públicos acessíveis.",
      "Financiar educação básica para ampliar oportunidades.",
      "Combater monopólios e práticas empresariais abusivas.",
      "Defender liberdades civis, religiosas e de expressão.",
    ] },
    { t: "p", lead: "Exemplo concreto:", text: "uma empresa pode gerar lucro livremente, mas deve respeitar normas trabalhistas, ambientais e de proteção ao consumidor." },
    { t: "h", text: "Libertarianismo" },
    { t: "p", text: "Coloca a liberdade individual no centro da organização política." },
    { t: "p", text: "Na sua vertente econômica de direita, normalmente defende menor tributação, forte proteção da propriedade privada e intervenção estatal limitada." },
    { t: "ol", items: [
      "Reduzir impostos e regulamentações econômicas.",
      "Permitir maior liberdade de contratação entre empresas e trabalhadores.",
      "Restringir a intervenção do governo em decisões pessoais consensuais.",
      "Diminuir a presença do Estado em atividades econômicas.",
    ] },
    { t: "p", lead: "Exemplo concreto:", text: "um libertário de direita poderia argumentar que o governo não deveria cobrar tantos tributos para financiar determinados serviços, pois os indivíduos deveriam ter mais liberdade para decidir onde gastar seu dinheiro." },
    { t: "p", lead: "Correção da nossa régua:", text: "libertarianismo não pertence exclusivamente à centro direita. Existem vertentes de esquerda e de direita, como explica a Enciclopédia de Filosofia de Stanford." },
    { t: "link", label: "Enciclopédia de Filosofia de Stanford", href: "https://plato.stanford.edu/entries/libertarianism/" },
  ] },
  { id: "direita", title: "Direita: Liberalismo econômico e conservadorismo", blocks: [
    { t: "p", lead: "Ideia central:", text: "dar maior importância à propriedade privada e à economia de mercado, no caso liberal, ou à preservação das tradições e instituições, no caso conservador." },
    { t: "h", text: "Liberalismo econômico" },
    { t: "p", text: "Defende a propriedade privada, a livre concorrência e a utilização dos mercados como mecanismos de organização econômica." },
    { t: "ol", items: [
      "Privatizar determinadas empresas estatais.",
      "Reduzir burocracia para abrir e administrar empresas.",
      "Diminuir barreiras comerciais para ampliar a concorrência.",
      "Defender disciplina fiscal e limites aos gastos públicos.",
    ] },
    { t: "p", lead: "Exemplo concreto:", text: "diante de uma empresa estatal deficitária, um liberal econômico poderia propor sua privatização, argumentando que a concorrência e os incentivos privados poderiam melhorar a eficiência. O resultado dependeria das condições do mercado e da qualidade da regulação." },
    { t: "h", text: "Conservadorismo" },
    { t: "p", text: "Prioriza a preservação de tradições, instituições e normas sociais, preferindo frequentemente mudanças graduais." },
    { t: "ol", items: [
      "Defender a preservação de práticas religiosas e culturais tradicionais.",
      "Apoiar políticas de valorização da família tradicional.",
      "Resistir a mudanças consideradas excessivamente rápidas nas normas sociais.",
      "Defender continuidade institucional, ordem e estabilidade.",
    ] },
    { t: "p", lead: "Exemplo concreto:", text: "diante de uma proposta de reforma educacional envolvendo valores familiares e sexualidade, um conservador poderia defender maior participação dos pais e preservação das orientações tradicionais." },
    { t: "p", lead: "Diferença fundamental:", text: "alguém pode ser liberal na economia e conservador nos costumes, mas também pode ser conservador e defender forte intervenção estatal na economia." },
  ] },
  { id: "direita-radical", title: "Direita radical: Nacionalismo radical e conservadorismo radical", blocks: [
    { t: "p", lead: "Ideia central:", text: "enfatizar intensamente a identidade nacional, a soberania e a preservação de uma determinada ordem cultural." },
    { t: "p", text: "O nacionalismo, isoladamente, não caracteriza a direita radical. Existem movimentos nacionalistas democráticos e de esquerda." },
    { t: "p", text: "Na direita radical, o nacionalismo pode assumir características mais excludentes, especialmente quando é combinado com hostilidade à imigração, pluralismo cultural e direitos de minorias." },
    { t: "h", text: "Exemplos práticos" },
    { t: "ol", items: [
      "Defender restrições amplas à imigração com justificativas de preservação cultural.",
      "Propor políticas que privilegiem cidadãos nacionais em determinados benefícios.",
      "Rejeitar acordos internacionais considerados ameaças à soberania.",
      "Defender uma concepção mais homogênea da identidade nacional.",
    ] },
    { t: "p", lead: "Exemplo concreto:", text: "um governo nacionalista radical poderia propor restringir significativamente a entrada de estrangeiros, argumentando que a imigração ameaça a identidade cultural do país." },
    { t: "p", lead: "Diferença importante:", text: "defender a indústria nacional, a soberania brasileira ou o patrimônio cultural não basta para caracterizar alguém como integrante da direita radical." },
    { t: "p", text: "Na ciência política, algumas correntes da direita radical também são distinguidas pela relação com o pluralismo e os direitos das minorias." },
  ] },
  { id: "fascismo", title: "Extrema direita: Fascismo", blocks: [
    { t: "p", lead: "Ideia central:", text: "organizar a sociedade em torno de um nacionalismo extremo, de uma autoridade política concentrada e da subordinação das liberdades individuais ao projeto nacional." },
    { t: "p", text: "O fascismo é uma ideologia autoritária e ultranacionalista que se desenvolveu especialmente na Europa durante o século XX." },
    { t: "h", text: "Exemplos históricos e práticos" },
    { t: "ol", items: [
      "Eliminar ou restringir severamente partidos de oposição.",
      "Concentrar o poder em um líder e enfraquecer mecanismos de fiscalização.",
      "Utilizar propaganda estatal para promover um projeto nacional único.",
      "Reprimir sindicatos, movimentos políticos e grupos considerados inimigos.",
      "Justificar perseguições e violência política em nome da unidade nacional.",
    ] },
    { t: "p", lead: "Exemplo histórico:", text: "a Itália de Benito Mussolini, entre 1922 e 1943, consolidou um regime fascista com repressão da oposição, partido dominante e culto à liderança." },
    { t: "p", text: "A Alemanha nazista também apresentou características fascistas, com o agravante central do racismo biológico e da política genocida do regime." },
    { t: "p", text: "Segundo o Museu Memorial do Holocausto dos Estados Unidos, o fascismo se caracteriza por ultranacionalismo, autoritarismo, militarismo e rejeição à democracia pluralista." },
    { t: "link", label: "Holocaust Encyclopedia", href: "https://encyclopedia.ushmm.org/" },
    { t: "p", lead: "Diferença fundamental:", text: "ser conservador ou nacionalista não torna alguém fascista. O fascismo envolve um conjunto específico de características políticas, institucionais e ideológicas." },
  ] },
];

export const SPECTRUM_COMPARISON: SpectrumSection = { id: "comparacao", title: "Comparação prática: um mesmo problema, diferentes propostas", blocks: [
  { t: "p", text: "Imagine que o Brasil precisa decidir como organizar o atendimento à saúde." },
  { t: "table", head: ["Corrente", "Exemplo de solução que poderia defender"], rows: [
    ["Comunismo", "Organização coletiva da produção e distribuição dos recursos de saúde, sem propriedade capitalista do setor"],
    ["Socialismo", "Ampliação da propriedade e do controle social sobre hospitais e serviços"],
    ["Social democracia", "Sistema público universal financiado por tributos, coexistindo com serviços privados regulados"],
    ["Progressismo", "Foco em eliminar discriminações e barreiras de acesso a grupos vulneráveis"],
    ["Centro político", "Combinação de hospitais públicos, privados e parcerias conforme resultados e custos"],
    ["Liberalismo social", "Serviços privados com regulação e garantias públicas de acesso"],
    ["Libertarianismo de direita", "Maior liberdade de escolha e contratação, com menor intervenção estatal"],
    ["Liberalismo econômico", "Concorrência e participação privada para buscar eficiência"],
    ["Conservadorismo", "Preservação de instituições e modelos considerados estáveis, com reformas prudentes"],
    ["Direita radical nacionalista", "Prioridade à soberania nacional e, em algumas vertentes, preferência a cidadãos nacionais"],
    ["Fascismo", "Organização subordinada ao Estado autoritário e aos objetivos do regime"],
  ] },
  { t: "p", text: "Esses são exemplos hipotéticos de propostas compatíveis com cada ideologia, não posições que todos os seus seguidores necessariamente defenderiam." },
] };

export const SPECTRUM_CORRECTIONS: SpectrumSection = { id: "correcoes", title: "O que precisa ser corrigido no nosso espectro?", blocks: [
  { t: "p", text: "A imagem original é útil para ensinar, mas contém algumas simplificações que podem induzir ao erro." },
  { t: "ul", items: [
    "Progressismo: pode existir na esquerda, no centro e até em setores da direita.",
    "Socialismo democrático: muitas vezes está mais próximo da esquerda do que da centro esquerda.",
    "Liberalismo social: pode ocupar o centro ou a centro esquerda, não apenas a centro direita.",
    "Libertarianismo: possui vertentes de esquerda e de direita.",
    "Nacionalismo: existe em diferentes posições, não apenas na direita radical.",
    "Fascismo: é uma ideologia específica da extrema direita, não sinônimo de toda a extrema direita.",
  ] },
  { t: "p", text: "Outra correção importante: não é adequado representar toda a esquerda como mais Estado e toda a direita como menos Estado. Regimes fascistas, por exemplo, exerceram forte controle estatal, embora não tivessem como objetivo a igualdade econômica socialista." },
  { t: "p", text: "Para compreender melhor qualquer posição política, vale separar três perguntas: quem controla os recursos econômicos, quais direitos e valores sociais devem ser protegidos e como o poder político deve ser exercido. Uma pessoa pode ter respostas diferentes em cada dimensão, sem que isso seja necessariamente uma contradição." },
] };
