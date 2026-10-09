/**
 * Descrição da ideologia da pessoa, no estilo "descrição de signo", mostrada abaixo de "Sua ideologia" no relatório.
 * Baseada nos textos do espectro escritos pela responsável (src/data/spectrum-terms.ts); aguarda revisão humana.
 * Chave = nome da ideologia em IDEOLOGY_RANGES.
 */
export interface IdeologyProfile { summary: string; economy: string; society: string; state: string; future: string; keywords: string[] }

export const IDEOLOGY_PROFILES: Record<string, IdeologyProfile> = {
  Comunismo: {
    summary: "Você quer mais do que corrigir o sistema: quer trocá-lo por outro.",
    economy: "Defende que fábricas, grandes indústrias e a infraestrutura deixem de pertencer a acionistas e passem a ser propriedade coletiva, com a produção planejada pelas necessidades das pessoas, e não pelo lucro.",
    society: "Sonha com uma sociedade sem classes, em que saúde, educação e moradia sejam garantidas coletivamente para todos.",
    state: "No horizonte da teoria, o Estado coercitivo deixaria de existir; até lá, a coletividade organizaria a produção e a distribuição.",
    future: "Um mundo sem patrões e sem divisão entre ricos e pobres.",
    keywords: ["Propriedade coletiva", "Planejamento", "Sociedade sem classes"],
  },
  Socialismo: {
    summary: "Você acha que a riqueza produzida por todos deveria ser decidida por todos, e não só por quem é dono.",
    economy: "Gosta de cooperativas em que os trabalhadores são donos da empresa e dividem os resultados. Defende controle público ou social de setores estratégicos, como energia e transportes.",
    society: "Quer trabalhadores participando das decisões das empresas e políticas que reduzam as desigualdades que vêm de berço.",
    state: "Deve usar a política econômica para corrigir desigualdades estruturais e ampliar o controle social sobre serviços como hospitais.",
    future: "Uma economia mais democrática, em que o lucro não seja o único critério para decidir o que se produz.",
    keywords: ["Cooperativas", "Controle social", "Igualdade"],
  },
  "Social-democracia": {
    summary: "Você acredita que dá para ter economia de mercado e, ao mesmo tempo, uma sociedade bem menos desigual.",
    economy: "Aceita empresas privadas e lucro, mas com regras que protejam consumidores e trabalhadores. Defende impostos progressivos: quem ganha mais paga proporcionalmente mais.",
    society: "Valoriza sindicatos fortes, direitos trabalhistas e programas de combate à pobreza.",
    state: "Deve garantir saúde e educação públicas e universais, como o SUS, financiadas por impostos e convivendo com serviços privados regulados.",
    future: "Um Brasil com bem-estar social no estilo dos países nórdicos: o mercado funcionando e ninguém ficando para trás.",
    keywords: ["Estado de bem-estar", "Impostos progressivos", "Direitos trabalhistas"],
  },
  Progressismo: {
    summary: "Você acha que a sociedade pode e deve melhorar, e que as leis precisam acompanhar a vida real das pessoas.",
    economy: "Não fica preso a um modelo econômico: pode defender empresas privadas e livre mercado, desde que as oportunidades cheguem a todos. Igualdade salarial entre homens e mulheres no mesmo trabalho é pauta sua.",
    society: "Apoia direitos iguais para famílias homoafetivas, inclusão de pessoas com deficiência e combate ao racismo e à desigualdade de oportunidades.",
    state: "Deve atualizar as leis quando normas antigas deixam grupos sem proteção e derrubar barreiras de acesso, como na saúde, para quem é mais vulnerável.",
    future: "Um Brasil em que origem, cor, gênero ou orientação não decidam até onde uma pessoa pode chegar.",
    keywords: ["Direitos civis", "Inclusão", "Igualdade de oportunidades"],
  },
  "Centro político": {
    summary: "Você desconfia de soluções prontas dos dois lados e gosta de juntar o que funciona em cada um.",
    economy: "Apoia programas sociais, mas com metas fiscais e as contas sob controle. Diante de uma privatização, pode preferir uma parceria entre Estado e setor privado.",
    society: "Quer manter os direitos trabalhistas, aceitando mudanças pontuais nas regras de contratação.",
    state: "Deve defender o SUS e, ao mesmo tempo, abrir espaço para investimento privado na saúde, escolhendo pelo resultado e pelo custo.",
    future: "Um país que avança por reformas graduais e negociação, sem rupturas.",
    keywords: ["Pragmatismo", "Reformas graduais", "Negociação"],
  },
  "Liberalismo social": {
    summary: "Você acredita na liberdade, inclusive a econômica, mas acha que liberdade de verdade exige chances reais para todos.",
    economy: "Defende o livre mercado e o lucro, com regras trabalhistas, ambientais e de defesa do consumidor, e o combate a monopólios e práticas abusivas.",
    society: "Valoriza as liberdades civis, religiosas e de expressão.",
    state: "Deve financiar a educação básica e garantir condições mínimas de vida; empresas privadas podem atuar na saúde, desde que os serviços públicos continuem acessíveis.",
    future: "Um país livre e competitivo, em que a origem de alguém não determine o seu destino.",
    keywords: ["Liberdade", "Oportunidades", "Concorrência"],
  },
  "Liberalismo econômico e conservadorismo": {
    summary: "Você aposta no esforço individual, na livre iniciativa e nas instituições que deram certo ao longo do tempo.",
    economy: "Defende privatizar estatais ineficientes, reduzir a burocracia para abrir empresas, diminuir barreiras ao comércio e manter disciplina fiscal, com limites aos gastos públicos.",
    society: "Valoriza a família e as tradições religiosas e culturais, e prefere que mudanças nos costumes venham devagar. Na educação, quer mais participação dos pais.",
    state: "Deve ser enxuto na economia e garantir ordem, estabilidade e a continuidade das instituições.",
    future: "Um país próspero, com as contas em dia, empresas fortes e valores preservados.",
    keywords: ["Livre mercado", "Responsabilidade fiscal", "Tradição"],
  },
  "Nacionalismo radical": {
    summary: "Para você, o Brasil e a identidade nacional vêm antes de tudo.",
    economy: "Prefere que benefícios e oportunidades priorizem cidadãos brasileiros e desconfia de acordos internacionais que limitem as decisões do país.",
    society: "Defende uma identidade nacional mais uniforme e restrições amplas à imigração, em nome da preservação cultural.",
    state: "Deve proteger a soberania acima de compromissos com outros países e organismos internacionais.",
    future: "Um Brasil que decide sozinho o próprio rumo, com a sua cultura preservada.",
    keywords: ["Soberania", "Identidade nacional", "Fronteiras"],
  },
  Fascismo: {
    summary: "Você coloca a nação acima das liberdades individuais.",
    economy: "A economia deve servir ao projeto nacional definido pelo Estado.",
    society: "Aceita restringir partidos de oposição, sindicatos e movimentos considerados inimigos, em nome da unidade nacional.",
    state: "Deve concentrar o poder em uma liderança forte, com propaganda oficial e pouca fiscalização.",
    future: "Uma nação unida em torno de um único projeto, com a ordem imposta.",
    keywords: ["Ultranacionalismo", "Autoridade", "Unidade"],
  },
};
