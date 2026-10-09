/**
 * "Na história": personagens, fotos e linha do tempo de cada corrente da régua do espectro político.
 * Fotos baixadas do Wikimedia Commons (domínio público ou Creative Commons, com crédito), servidas em /historia.
 * Texto de apoio escrito a pedido da responsável em 09/10/2026 (aguarda revisão humana).
 */
export interface HistoryFigure { slug: string; name: string; years: string; caption: string; credit: { author: string; license: string; page: string } }
export interface SectionHistory { figures: HistoryFigure[]; story: string[]; timeline: [year: string, event: string][] }

const PD = "Domínio público";

export const SPECTRUM_HISTORY: Record<string, SectionHistory> = {
  comunismo: {
    figures: [
      { slug: "marx", name: "Karl Marx", years: "1818–1883", caption: "Filósofo e economista alemão. Com Friedrich Engels, publicou o Manifesto Comunista (1848) e depois escreveu O Capital (1867), a base teórica do comunismo.", credit: { author: "John Jabez Edwin Mayall, 1875", license: PD, page: "https://commons.wikimedia.org/wiki/File:Karl_Marx_by_John_Jabez_Edwin_Mayall_1875_-_Restored.png" } },
      { slug: "lenin", name: "Vladimir Lenin", years: "1870–1924", caption: "Liderou a Revolução Russa de 1917, que levou os bolcheviques ao poder e deu origem à União Soviética.", credit: { author: "foto oficial, 1920", license: PD, page: "https://commons.wikimedia.org/wiki/File:Lenin_in_1920_(cropped).jpg" } },
    ],
    story: [
      "No século XX, regimes que se declaravam comunistas chegaram a governar cerca de um terço da população mundial. Na prática, foram Estados de partido único com economia planificada.",
      "Vários deles, como a União Soviética sob Stálin e a China sob Mao Tsé-tung, foram marcados por repressão política, perseguições e fomes que mataram milhões de pessoas. A maioria desses regimes terminou entre 1989 e 1991.",
      "No Brasil, o Partido Comunista foi fundado em 1922 e passou boa parte do século XX na ilegalidade.",
    ],
    timeline: [["1848", "Marx e Engels publicam o Manifesto Comunista."], ["1917", "Revolução Russa."], ["1922", "Fundação da União Soviética e do Partido Comunista no Brasil."], ["1949", "Revolução Chinesa, liderada por Mao Tsé-tung."], ["1959", "Revolução Cubana."], ["1989–1991", "Queda do Muro de Berlim e fim da União Soviética."]],
  },
  socialismo: {
    figures: [
      { slug: "luxemburgo", name: "Rosa Luxemburgo", years: "1871–1919", caption: "Pensadora e militante socialista polonesa-alemã. Defendia que o socialismo só faria sentido com democracia e liberdade de expressão. Foi assassinada em Berlim em 1919.", credit: { author: "autor desconhecido", license: PD, page: "https://commons.wikimedia.org/wiki/File:Rosa_Luxemburg_(cropped).jpg" } },
      { slug: "debs", name: "Eugene V. Debs", years: "1855–1926", caption: "Sindicalista americano, foi cinco vezes candidato socialista à presidência dos EUA. Em 1920, fez campanha de dentro da prisão e teve quase 1 milhão de votos.", credit: { author: "autor desconhecido", license: PD, page: "https://commons.wikimedia.org/wiki/File:Eugene_Debs_portrait.jpeg" } },
    ],
    story: [
      "O socialismo nasceu no século XIX, durante a Revolução Industrial, quando operários trabalhavam longas jornadas em condições duras. Sindicatos, cooperativas e partidos socialistas se espalharam pela Europa e pelas Américas.",
      "Muitos direitos que hoje parecem comuns, como a jornada de 8 horas, começaram como bandeiras desses movimentos.",
    ],
    timeline: [["1844", "Os Pioneiros de Rochdale, na Inglaterra, criam uma das primeiras cooperativas modernas."], ["1864", "A Primeira Internacional reúne trabalhadores de vários países."], ["1889", "O 1º de Maio passa a ser o dia internacional dos trabalhadores."], ["1917", "Greve geral em São Paulo, uma das maiores da história do Brasil."]],
  },
  "centro-esquerda": {
    figures: [
      { slug: "bernstein", name: "Eduard Bernstein", years: "1850–1932", caption: "Político alemão que, por volta de 1899, defendeu chegar a uma sociedade mais igual por reformas e eleições, não por revolução. A ideia deu origem à social-democracia moderna.", credit: { author: "autor desconhecido", license: PD, page: "https://commons.wikimedia.org/wiki/File:Eduard_Bernstein_(portrait).jpg" } },
      { slug: "attlee", name: "Clement Attlee", years: "1883–1967", caption: "Primeiro-ministro britânico de 1945 a 1951. Seu governo criou, em 1948, o NHS, o sistema público e gratuito de saúde do Reino Unido.", credit: { author: "atribuída a Yousuf Karsh", license: PD, page: "https://commons.wikimedia.org/wiki/File:Person_attlee2.jpg" } },
    ],
    story: [
      "Depois da Segunda Guerra Mundial, vários países da Europa construíram o chamado Estado de bem-estar social: saúde e educação públicas, aposentadoria e seguro-desemprego, financiados por impostos e convivendo com empresas privadas.",
      "A Suécia, governada por social-democratas por mais de quarenta anos, virou o exemplo mais citado desse modelo.",
    ],
    timeline: [["1932", "Social-democratas chegam ao governo da Suécia."], ["1948", "Criação do NHS no Reino Unido."], ["1959", "O partido social-democrata alemão abandona o marxismo e aceita a economia de mercado."], ["1988", "A Constituição brasileira cria o SUS, sistema universal de saúde financiado por impostos."]],
  },
  progressismo: {
    figures: [
      { slug: "king", name: "Martin Luther King Jr.", years: "1929–1968", caption: "Pastor e líder do movimento pelos direitos civis nos EUA. Defendia a luta não violenta contra a segregação racial e recebeu o Nobel da Paz em 1964.", credit: { author: "Yoichi Okamoto, 1966", license: PD, page: "https://commons.wikimedia.org/wiki/File:Martin_Luther_King,_Jr._and_Lyndon_Johnson_(cropped).jpg" } },
      { slug: "lutz", name: "Bertha Lutz", years: "1894–1976", caption: "Bióloga e líder feminista brasileira. Ajudou a conquistar o voto feminino no Brasil, em 1932, e foi uma das mulheres que garantiram a igualdade de gênero na Carta da ONU, em 1945.", credit: { author: "1925, restauração de Adam Cuerden", license: PD, page: "https://commons.wikimedia.org/wiki/File:Bertha_Lutz_1925.jpg" } },
    ],
    story: [
      "O nome vem da \"Era Progressista\" dos Estados Unidos (de 1890 a 1920), quando movimentos defenderam reformas contra a corrupção, leis trabalhistas, regras para grandes empresas e o voto das mulheres.",
      "Ao longo do século XX, o termo passou a reunir lutas por ampliação de direitos: das mulheres, da população negra, de pessoas com deficiência e de pessoas LGBT.",
    ],
    timeline: [["1888", "Lei Áurea abole a escravidão no Brasil."], ["1932", "Mulheres conquistam o direito de votar no Brasil."], ["1964", "Lei dos Direitos Civis proíbe a segregação racial nos EUA."], ["1989", "Lei Caó torna o racismo crime no Brasil."], ["2011", "O STF reconhece a união estável entre pessoas do mesmo sexo."]],
  },
  centro: {
    figures: [
      { slug: "jk", name: "Juscelino Kubitschek", years: "1902–1976", caption: "Presidente de 1956 a 1961, pelo PSD, partido de centro, em aliança com o PTB. Governou com o Plano de Metas (\"50 anos em 5\") e construiu Brasília.", credit: { author: "Governo do Brasil, 1956", license: PD, page: "https://commons.wikimedia.org/wiki/File:Juscelino_Kubitschek_in_1956.jpg" } },
      { slug: "ulysses", name: "Ulysses Guimarães", years: "1916–1992", caption: "Deputado que presidiu a Assembleia Constituinte. Conduziu a negociação entre grupos de esquerda, centro e direita que resultou na Constituição de 1988.", credit: { author: "Arquivo da Agência Brasil", license: "CC BY 3.0 BR", page: "https://commons.wikimedia.org/wiki/File:Ulysses_nas_Diretas_J%C3%A1.jpg" } },
    ],
    story: [
      "O centro político costuma aparecer em momentos de negociação: governos de coalizão, transições de regime e reformas feitas por acordo entre partidos diferentes.",
      "Nos anos 1990, a chamada \"Terceira Via\", associada a Tony Blair no Reino Unido, tentou combinar economia de mercado com políticas sociais.",
    ],
    timeline: [["1956", "JK assume a presidência com uma aliança entre PSD e PTB."], ["1985", "Fim da ditadura militar; transição negociada para um governo civil."], ["1988", "Promulgação da Constituição, a \"Constituição Cidadã\"."], ["1997", "Tony Blair chega ao governo britânico com a proposta da Terceira Via."]],
  },
  "centro-direita": {
    figures: [
      { slug: "mill", name: "John Stuart Mill", years: "1806–1873", caption: "Filósofo inglês, autor de Sobre a Liberdade (1859). Defendia a liberdade individual, a liberdade de expressão e o voto das mulheres.", credit: { author: "London Stereoscopic Company, c. 1870", license: PD, page: "https://commons.wikimedia.org/wiki/File:John_Stuart_Mill_by_London_Stereoscopic_Company,_c1870.jpg" } },
      { slug: "hayek", name: "Friedrich Hayek", years: "1899–1992", caption: "Economista austríaco, autor de O Caminho da Servidão (1944), crítico do planejamento estatal da economia. Ganhou o Nobel de Economia em 1974 e é referência para liberais e libertários.", credit: { author: "DickClarkMises (Wikipedia)", license: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:Friedrich_Hayek_portrait.jpg" } },
    ],
    story: [
      "O liberalismo nasceu nos séculos XVII e XVIII, contra o poder absoluto dos reis: defendia direitos individuais, governo limitado por leis e liberdade de comércio.",
      "No século XX, uma parte dos liberais passou a aceitar o Estado garantindo oportunidades mínimas (liberalismo social); outra parte, os libertários, defendeu reduzir ao máximo o papel do governo.",
    ],
    timeline: [["1689", "John Locke defende os direitos à vida, à liberdade e à propriedade."], ["1859", "Mill publica Sobre a Liberdade."], ["1944", "Hayek publica O Caminho da Servidão."], ["1974", "Robert Nozick publica Anarquia, Estado e Utopia, clássico libertário."]],
  },
  direita: {
    figures: [
      { slug: "smith", name: "Adam Smith", years: "1723–1790", caption: "Economista escocês, autor de A Riqueza das Nações (1776). Considerado o pai da economia moderna, descreveu como a concorrência e a divisão do trabalho geram riqueza.", credit: { author: "autor desconhecido", license: PD, page: "https://commons.wikimedia.org/wiki/File:Adam_Smith_The_Muir_portrait.jpg" } },
      { slug: "burke", name: "Edmund Burke", years: "1729–1797", caption: "Político irlandês no Parlamento britânico. Em Reflexões sobre a Revolução na França (1790), defendeu mudanças graduais e o respeito às tradições, base do conservadorismo moderno.", credit: { author: "Joshua Reynolds (pintura)", license: PD, page: "https://commons.wikimedia.org/wiki/File:Sir_Joshua_Reynolds_-_Edmund_Burke,_1729_-_1797._Statesman,_orator_and_author_-_PG_2362_-_National_Galleries_of_Scotland_(cropped).jpg" } },
    ],
    story: [
      "O liberalismo econômico e o conservadorismo nasceram em tempos parecidos, no fim do século XVIII, e muitas vezes caminharam juntos: um defendendo o mercado e a propriedade, o outro defendendo tradições e instituições.",
      "Nos anos 1980, Margaret Thatcher, no Reino Unido, e Ronald Reagan, nos EUA, combinaram as duas ideias: privatizações, corte de impostos e defesa de valores tradicionais.",
    ],
    timeline: [["1776", "Adam Smith publica A Riqueza das Nações."], ["1790", "Burke publica Reflexões sobre a Revolução na França."], ["1979–1990", "Margaret Thatcher governa o Reino Unido."], ["1990s", "Onda de privatizações no Brasil, como a Vale (1997) e o sistema Telebras (1998)."]],
  },
  "direita-radical": {
    figures: [
      { slug: "maurras", name: "Charles Maurras", years: "1868–1952", caption: "Escritor francês, líder da Action Française. Pregava um \"nacionalismo integral\", monarquista e antissemita; apoiou o regime colaboracionista de Vichy e foi condenado em 1945.", credit: { author: "Studio Harcourt, 1937", license: PD, page: "https://commons.wikimedia.org/wiki/File:Portrait_of_Charles_Maurras_by_Studio_Harcourt_1937_(3x4_cropped).jpg" } },
    ],
    story: [
      "Movimentos nacionalistas radicais cresceram na Europa no fim do século XIX e entre as duas guerras mundiais, muitas vezes com hostilidade a estrangeiros, a minorias e à democracia liberal.",
      "Hoje, a ciência política usa o termo \"direita radical\" para partidos que combinam nacionalismo forte, restrição à imigração e críticas às elites, mas que disputam eleições, diferentemente da extrema direita que rejeita a democracia.",
    ],
    timeline: [["1899", "Fundação da Action Française."], ["1932", "Fundação da Ação Integralista Brasileira, movimento nacionalista inspirado no fascismo europeu."], ["1937", "O integralismo é posto na ilegalidade pelo Estado Novo."]],
  },
  fascismo: {
    figures: [
      { slug: "mussolini", name: "Benito Mussolini", years: "1883–1945", caption: "Fundou o fascismo em 1919, chegou ao poder após a Marcha sobre Roma (1922) e governou a Itália como ditador até 1943, aliado de Hitler na Segunda Guerra.", credit: { author: "autor desconhecido", license: PD, page: "https://commons.wikimedia.org/wiki/File:Mussolini_mezzobusto.jpg" } },
      { slug: "hitler", name: "Adolf Hitler", years: "1889–1945", caption: "Líder do Partido Nazista, governou a Alemanha de 1933 a 1945. Seu regime iniciou a Segunda Guerra Mundial e realizou o Holocausto, o assassinato de 6 milhões de judeus e de milhões de outras vítimas.", credit: { author: "Heinrich Hoffmann (Bundesarchiv)", license: "CC BY-SA 3.0 DE", page: "https://commons.wikimedia.org/wiki/File:Hitler_portrait_crop_(cropped)(2).jpg" } },
    ],
    story: [
      "O fascismo surgiu na Itália depois da Primeira Guerra Mundial, em meio a crise econômica e medo de revoluções. Inspirou regimes e movimentos em vários países nos anos 1920 e 1930.",
      "A Segunda Guerra Mundial (1939–1945), iniciada pela Alemanha nazista, matou cerca de 70 milhões de pessoas. O Brasil enviou a Força Expedicionária Brasileira, que lutou contra as tropas nazistas e fascistas na Itália.",
    ],
    timeline: [["1919", "Mussolini funda o movimento fascista."], ["1922", "Marcha sobre Roma: Mussolini chega ao poder."], ["1933", "Hitler chega ao poder na Alemanha."], ["1939–1945", "Segunda Guerra Mundial e Holocausto."], ["1944", "A Força Expedicionária Brasileira desembarca na Itália."], ["1945", "Derrota da Alemanha nazista e da Itália fascista."]],
  },
};
