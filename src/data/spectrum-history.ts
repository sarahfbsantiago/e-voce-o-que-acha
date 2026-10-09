/**
 * "Na história": personagens, fotos e linha do tempo de cada corrente da régua do espectro político.
 * Fotos baixadas do Wikimedia Commons (domínio público ou Creative Commons, com crédito), servidas em /historia.
 * Texto de apoio escrito a pedido da responsável em 09/10/2026 (aguarda revisão humana).
 */
export interface HistoryFigure { slug: string; name: string; years: string; caption: string; credit: { author: string; license: string; page: string } }
export interface SectionHistory { figures: HistoryFigure[]; chapters: { title: string; text: string }[]; timeline: [year: string, event: string][] }

const PD = "Domínio público";

export const SPECTRUM_HISTORY: Record<string, SectionHistory> = {
  comunismo: {
    figures: [
      { slug: "marx", name: "Karl Marx", years: "1818–1883", caption: "Filósofo e economista alemão. Com Friedrich Engels, publicou o Manifesto Comunista (1848) e depois escreveu O Capital (1867), a base teórica do comunismo.", credit: { author: "John Jabez Edwin Mayall, 1875", license: PD, page: "https://commons.wikimedia.org/wiki/File:Karl_Marx_by_John_Jabez_Edwin_Mayall_1875_-_Restored.png" } },
      { slug: "lenin", name: "Vladimir Lenin", years: "1870–1924", caption: "Liderou a Revolução Russa de 1917, que levou os bolcheviques ao poder e deu origem à União Soviética.", credit: { author: "foto oficial, 1920", license: PD, page: "https://commons.wikimedia.org/wiki/File:Lenin_in_1920_(cropped).jpg" } },
    ],
    chapters: [
      { title: "O mundo em que nasceu", text: "No século XIX, a Revolução Industrial encheu as cidades europeias de fábricas. Homens, mulheres e crianças trabalhavam 14, 16 horas por dia, por salários baixos, e moravam em bairros sem saneamento. Marx e Engels viram nisso uma luta entre a burguesia, dona das fábricas, e o proletariado, que só tinha o próprio trabalho para vender, e previram que os trabalhadores um dia tomariam o controle da produção." },
      { title: "Como chegou ao poder", text: "Na Rússia, a Primeira Guerra Mundial trouxe milhões de mortos, fome e colapso econômico. Em fevereiro de 1917, o czar Nicolau II abdicou, mas o governo provisório continuou na guerra. Os bolcheviques de Lenin conquistaram soldados, operários e camponeses com o lema \"paz, terra e pão\" e tomaram o poder em outubro. Seguiu-se uma guerra civil até 1922." },
      { title: "Como governou", text: "Depois de Lenin, Stálin industrializou o país em ritmo acelerado e coletivizou à força as terras dos camponeses, o que provocou fomes como a da Ucrânia (1932–1933). Opositores, reais ou imaginários, foram executados ou mandados para campos de trabalho, os gulags. Na China, o Grande Salto Adiante de Mao (1958–1962) causou uma fome com dezenas de milhões de mortos. Ao mesmo tempo, esses regimes ampliaram a alfabetização, a industrialização e o acesso à saúde." },
      { title: "Como terminou", text: "Nos anos 1980, a economia soviética estagnou. As reformas de Gorbatchov abriram espaço para protestos, o Muro de Berlim caiu em 1989 e a União Soviética se dissolveu em 1991. China, Vietnã e Cuba continuam governados por partidos comunistas, mas a China adotou a economia de mercado a partir de 1978." },
    ],
    timeline: [["1848", "Marx e Engels publicam o Manifesto Comunista."], ["1917", "Revolução Russa."], ["1922", "Fundação da União Soviética e do Partido Comunista no Brasil."], ["1949", "Revolução Chinesa, liderada por Mao Tsé-tung."], ["1959", "Revolução Cubana."], ["1989–1991", "Queda do Muro de Berlim e fim da União Soviética."]],
  },
  socialismo: {
    figures: [
      { slug: "luxemburgo", name: "Rosa Luxemburgo", years: "1871–1919", caption: "Pensadora e militante socialista polonesa-alemã. Defendia que o socialismo só faria sentido com democracia e liberdade de expressão. Foi assassinada em Berlim em 1919.", credit: { author: "autor desconhecido", license: PD, page: "https://commons.wikimedia.org/wiki/File:Rosa_Luxemburg_(cropped).jpg" } },
      { slug: "debs", name: "Eugene V. Debs", years: "1855–1926", caption: "Sindicalista americano, foi cinco vezes candidato socialista à presidência dos EUA. Em 1920, fez campanha de dentro da prisão e teve quase 1 milhão de votos.", credit: { author: "autor desconhecido", license: PD, page: "https://commons.wikimedia.org/wiki/File:Eugene_Debs_portrait.jpeg" } },
    ],
    chapters: [
      { title: "O mundo em que nasceu", text: "Diante da miséria das fábricas no século XIX, pensadores como Robert Owen criaram vilas operárias e cooperativas para mostrar que outro modelo era possível. Depois, Marx deu ao socialismo uma teoria econômica, e sindicatos e partidos operários se espalharam pela Europa." },
      { title: "Como conquistou apoio", text: "Com a ampliação do direito de voto, os partidos socialistas e trabalhistas cresceram rapidamente, prometendo jornada de 8 horas, salários dignos e proteção na velhice e na doença. A pressão foi tanta que governos conservadores, como o de Bismarck na Alemanha, criaram as primeiras aposentadorias públicas na década de 1880, em parte para tirar força dos socialistas." },
      { title: "A grande divisão", text: "O movimento brigava entre fazer revolução ou reformas. Depois de 1917 ele se dividiu: os comunistas seguiram o modelo soviético, e os socialistas democráticos e social-democratas apostaram em eleições e no parlamento." },
      { title: "No Brasil", text: "Imigrantes italianos e espanhóis trouxeram ideias socialistas e anarquistas no começo do século XX. A greve geral de 1917, em São Paulo, parou a cidade. Várias reivindicações daquela época, como férias, limite de jornada e salário mínimo, viraram lei décadas depois, na CLT de 1943." },
    ],
    timeline: [["1844", "Os Pioneiros de Rochdale, na Inglaterra, criam uma das primeiras cooperativas modernas."], ["1864", "A Primeira Internacional reúne trabalhadores de vários países."], ["1889", "O 1º de Maio passa a ser o dia internacional dos trabalhadores."], ["1917", "Greve geral em São Paulo, uma das maiores da história do Brasil."]],
  },
  "centro-esquerda": {
    figures: [
      { slug: "bernstein", name: "Eduard Bernstein", years: "1850–1932", caption: "Político alemão que, por volta de 1899, defendeu chegar a uma sociedade mais igual por reformas e eleições, não por revolução. A ideia deu origem à social-democracia moderna.", credit: { author: "autor desconhecido", license: PD, page: "https://commons.wikimedia.org/wiki/File:Eduard_Bernstein_(portrait).jpg" } },
      { slug: "attlee", name: "Clement Attlee", years: "1883–1967", caption: "Primeiro-ministro britânico de 1945 a 1951. Seu governo criou, em 1948, o NHS, o sistema público e gratuito de saúde do Reino Unido.", credit: { author: "atribuída a Yousuf Karsh", license: PD, page: "https://commons.wikimedia.org/wiki/File:Person_attlee2.jpg" } },
    ],
    chapters: [
      { title: "A virada: reformar em vez de derrubar", text: "Por volta de 1899, Eduard Bernstein argumentou que o capitalismo não estava prestes a desabar e que os trabalhadores podiam melhorar de vida pelo voto, pelos sindicatos e por reformas. Era o nascimento da social-democracia moderna." },
      { title: "A crise de 1929 e o modelo sueco", text: "A Grande Depressão deixou milhões de desempregados. Na Suécia, os social-democratas chegaram ao governo em 1932 e fecharam, em 1938, um acordo entre sindicatos e empresários: as empresas continuavam privadas e lucrativas, e o Estado garantia emprego, aposentadoria, saúde e educação. Chamaram isso de \"lar do povo\"." },
      { title: "O pós-guerra", text: "Depois de 1945, a Europa precisava ser reconstruída. No Reino Unido, o Relatório Beveridge (1942) propôs proteger as pessoas \"do berço ao túmulo\", e o governo Attlee criou o sistema público de saúde em 1948. Entre 1945 e 1973, muitos países europeus cresceram rápido com Estado de bem-estar social." },
      { title: "Desafios", text: "Nos anos 1970, a inflação e a crise do petróleo puseram o modelo em xeque, e vários países fizeram reformas. Hoje, os países nórdicos têm impostos altos e estão entre os de melhor qualidade de vida do mundo." },
    ],
    timeline: [["1932", "Social-democratas chegam ao governo da Suécia."], ["1948", "Criação do NHS no Reino Unido."], ["1959", "O partido social-democrata alemão abandona o marxismo e aceita a economia de mercado."], ["1988", "A Constituição brasileira cria o SUS, sistema universal de saúde financiado por impostos."]],
  },
  progressismo: {
    figures: [
      { slug: "king", name: "Martin Luther King Jr.", years: "1929–1968", caption: "Pastor e líder do movimento pelos direitos civis nos EUA. Defendia a luta não violenta contra a segregação racial e recebeu o Nobel da Paz em 1964.", credit: { author: "Yoichi Okamoto, 1966", license: PD, page: "https://commons.wikimedia.org/wiki/File:Martin_Luther_King,_Jr._and_Lyndon_Johnson_(cropped).jpg" } },
      { slug: "lutz", name: "Bertha Lutz", years: "1894–1976", caption: "Bióloga e líder feminista brasileira. Ajudou a conquistar o voto feminino no Brasil, em 1932, e foi uma das mulheres que garantiram a igualdade de gênero na Carta da ONU, em 1945.", credit: { author: "1925, restauração de Adam Cuerden", license: PD, page: "https://commons.wikimedia.org/wiki/File:Bertha_Lutz_1925.jpg" } },
    ],
    chapters: [
      { title: "De onde vem o nome", text: "Nos Estados Unidos, por volta de 1890, poucas empresas gigantes dominavam setores inteiros, crianças trabalhavam em fábricas e minas, e a corrupção era comum. Jornalistas investigativos expuseram esses problemas, e o chamado movimento progressista conseguiu leis contra monopólios, regras de segurança no trabalho e, em 1920, o voto das mulheres." },
      { title: "Como conquistou apoio", text: "O progressismo do século XX cresceu com movimentos que davam rosto às injustiças. Em 1955, Rosa Parks se recusou a ceder seu lugar a um branco num ônibus e deu início a um boicote liderado por Martin Luther King. Em 1963, a Marcha sobre Washington reuniu cerca de 250 mil pessoas no discurso \"Eu tenho um sonho\". No ano seguinte veio a Lei dos Direitos Civis." },
      { title: "No Brasil", text: "Bertha Lutz e outras mulheres conquistaram o voto feminino em 1932. A Constituição de 1988 tornou o racismo crime inafiançável, a Lei Maria da Penha (2006) criou proteção contra a violência doméstica e, em 2011, o STF reconheceu a união entre pessoas do mesmo sexo." },
    ],
    timeline: [["1888", "Lei Áurea abole a escravidão no Brasil."], ["1932", "Mulheres conquistam o direito de votar no Brasil."], ["1964", "Lei dos Direitos Civis proíbe a segregação racial nos EUA."], ["1989", "Lei Caó torna o racismo crime no Brasil."], ["2011", "O STF reconhece a união estável entre pessoas do mesmo sexo."]],
  },
  centro: {
    figures: [
      { slug: "jk", name: "Juscelino Kubitschek", years: "1902–1976", caption: "Presidente de 1956 a 1961, pelo PSD, partido de centro, em aliança com o PTB. Governou com o Plano de Metas (\"50 anos em 5\") e construiu Brasília.", credit: { author: "Governo do Brasil, 1956", license: PD, page: "https://commons.wikimedia.org/wiki/File:Juscelino_Kubitschek_in_1956.jpg" } },
      { slug: "ulysses", name: "Ulysses Guimarães", years: "1916–1992", caption: "Deputado que presidiu a Assembleia Constituinte. Conduziu a negociação entre grupos de esquerda, centro e direita que resultou na Constituição de 1988.", credit: { author: "Arquivo da Agência Brasil", license: "CC BY 3.0 BR", page: "https://commons.wikimedia.org/wiki/File:Ulysses_nas_Diretas_J%C3%A1.jpg" } },
    ],
    chapters: [
      { title: "O centro na República de 1946", text: "Entre 1946 e 1964, o PSD, partido de centro, fazia a ponte entre a UDN, à direita, e o PTB, trabalhista. Juscelino Kubitschek venceu em 1955 com a aliança PSD-PTB, prometeu \"50 anos em 5\" e inaugurou Brasília em 1960. O país cresceu muito, mas a inflação e a dívida também." },
      { title: "A transição negociada", text: "Nos anos 1980, a campanha das Diretas Já (1984) levou milhões às ruas; Ulysses Guimarães ficou conhecido como \"Senhor Diretas\". A emenda não passou, e a saída foi um acordo: em 1985, Tancredo Neves foi eleito pelo Colégio Eleitoral com votos da oposição e de dissidentes do regime, encerrando a ditadura sem ruptura." },
      { title: "A Constituinte", text: "Em 1987 e 1988, deputados de todos os lados negociaram artigo por artigo. Um grande bloco de centro, que ficou conhecido como Centrão, foi decisivo nas votações. O resultado foi a Constituição de 1988." },
      { title: "No mundo", text: "Depois do fim da Guerra Fria, a \"Terceira Via\" de Tony Blair, no Reino Unido, e de Bill Clinton, nos EUA, tentou combinar economia de mercado, responsabilidade fiscal e políticas sociais." },
    ],
    timeline: [["1956", "JK assume a presidência com uma aliança entre PSD e PTB."], ["1985", "Fim da ditadura militar; transição negociada para um governo civil."], ["1988", "Promulgação da Constituição, a \"Constituição Cidadã\"."], ["1997", "Tony Blair chega ao governo britânico com a proposta da Terceira Via."]],
  },
  "centro-direita": {
    figures: [
      { slug: "mill", name: "John Stuart Mill", years: "1806–1873", caption: "Filósofo inglês, autor de Sobre a Liberdade (1859). Defendia a liberdade individual, a liberdade de expressão e o voto das mulheres.", credit: { author: "London Stereoscopic Company, c. 1870", license: PD, page: "https://commons.wikimedia.org/wiki/File:John_Stuart_Mill_by_London_Stereoscopic_Company,_c1870.jpg" } },
      { slug: "hayek", name: "Friedrich Hayek", years: "1899–1992", caption: "Economista austríaco, autor de O Caminho da Servidão (1944), crítico do planejamento estatal da economia. Ganhou o Nobel de Economia em 1974 e é referência para liberais e libertários.", credit: { author: "DickClarkMises (Wikipedia)", license: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:Friedrich_Hayek_portrait.jpg" } },
    ],
    chapters: [
      { title: "Contra o poder absoluto dos reis", text: "O liberalismo nasceu quando reis governavam sem limites. A Revolução Gloriosa (1688) submeteu o rei inglês ao Parlamento, e John Locke escreveu que todos têm direito à vida, à liberdade e à propriedade. Essas ideias inspiraram a Independência dos EUA (1776) e a Revolução Francesa (1789)." },
      { title: "O liberalismo social", text: "No fim do século XIX, alguns liberais perceberam que a pobreza extrema também tirava a liberdade das pessoas. O governo liberal britânico de 1906 a 1914 criou aposentadorias e seguro-saúde para trabalhadores, sem abrir mão do mercado. É a origem do liberalismo social." },
      { title: "O libertarianismo", text: "No século XX, diante do crescimento do Estado e dos regimes totalitários, pensadores como Hayek e Ludwig von Mises alertaram contra o planejamento central da economia. Em 1974, Robert Nozick defendeu um Estado mínimo, limitado a proteger as pessoas, os contratos e a propriedade." },
    ],
    timeline: [["1689", "John Locke defende os direitos à vida, à liberdade e à propriedade."], ["1859", "Mill publica Sobre a Liberdade."], ["1944", "Hayek publica O Caminho da Servidão."], ["1974", "Robert Nozick publica Anarquia, Estado e Utopia, clássico libertário."]],
  },
  direita: {
    figures: [
      { slug: "smith", name: "Adam Smith", years: "1723–1790", caption: "Economista escocês, autor de A Riqueza das Nações (1776). Considerado o pai da economia moderna, descreveu como a concorrência e a divisão do trabalho geram riqueza.", credit: { author: "autor desconhecido", license: PD, page: "https://commons.wikimedia.org/wiki/File:Adam_Smith_The_Muir_portrait.jpg" } },
      { slug: "burke", name: "Edmund Burke", years: "1729–1797", caption: "Político irlandês no Parlamento britânico. Em Reflexões sobre a Revolução na França (1790), defendeu mudanças graduais e o respeito às tradições, base do conservadorismo moderno.", credit: { author: "Joshua Reynolds (pintura)", license: PD, page: "https://commons.wikimedia.org/wiki/File:Sir_Joshua_Reynolds_-_Edmund_Burke,_1729_-_1797._Statesman,_orator_and_author_-_PG_2362_-_National_Galleries_of_Scotland_(cropped).jpg" } },
    ],
    chapters: [
      { title: "Mercado contra o mercantilismo", text: "Em 1776, Adam Smith criticou os monopólios e as barreiras comerciais que os reis usavam para enriquecer o Estado. Para ele, a riqueza das nações vinha do trabalho, da concorrência e da troca livre, como se uma \"mão invisível\" coordenasse os interesses individuais." },
      { title: "A reação à Revolução Francesa", text: "Edmund Burke viu na Revolução Francesa o risco de destruir de uma vez instituições construídas ao longo de séculos. Quando a revolução chegou ao período do Terror (1793–1794), com milhares de execuções, muitos passaram a concordar com ele. Nascia o conservadorismo moderno: mudar, sim, mas com prudência." },
      { title: "A virada dos anos 1980", text: "Nos anos 1970, inflação alta, desemprego e greves abalaram países ricos. Margaret Thatcher (1979) e Ronald Reagan (1981) venceram eleições prometendo controlar a inflação, cortar impostos, reduzir o poder dos sindicatos e defender valores tradicionais. Os defensores apontam a retomada do crescimento; os críticos, o aumento da desigualdade." },
      { title: "No Brasil", text: "O Plano Real (1994) controlou a hiperinflação. Nos anos 1990, empresas estatais foram privatizadas, e a Lei de Responsabilidade Fiscal (2000) passou a limitar os gastos dos governos." },
    ],
    timeline: [["1776", "Adam Smith publica A Riqueza das Nações."], ["1790", "Burke publica Reflexões sobre a Revolução na França."], ["1979–1990", "Margaret Thatcher governa o Reino Unido."], ["1990s", "Onda de privatizações no Brasil, como a Vale (1997) e o sistema Telebras (1998)."]],
  },
  "direita-radical": {
    figures: [
      { slug: "maurras", name: "Charles Maurras", years: "1868–1952", caption: "Escritor francês, líder da Action Française. Pregava um \"nacionalismo integral\", monarquista e antissemita; apoiou o regime colaboracionista de Vichy e foi condenado em 1945.", credit: { author: "Studio Harcourt, 1937", license: PD, page: "https://commons.wikimedia.org/wiki/File:Portrait_of_Charles_Maurras_by_Studio_Harcourt_1937_(3x4_cropped).jpg" } },
    ],
    chapters: [
      { title: "O caso Dreyfus", text: "Em 1894, o capitão judeu Alfred Dreyfus foi condenado injustamente por traição na França. O caso dividiu o país. Contra os defensores de Dreyfus, nasceu a Action Française, de Charles Maurras: nacionalista, monarquista, antissemita e contrária à República." },
      { title: "Entre as guerras", text: "Crises econômicas e o medo do comunismo fortaleceram movimentos nacionalistas em vários países. No Brasil, a Ação Integralista de Plínio Salgado (1932) chegou a reunir centenas de milhares de membros, com uniformes e desfiles inspirados no fascismo europeu. Foi fechada pelo Estado Novo, e uma tentativa de golpe integralista em 1938 fracassou." },
      { title: "Depois de 1945", text: "Com a derrota do fascismo, essas ideias perderam força. A partir dos anos 1980, partidos de direita radical voltaram a crescer na Europa explorando temas como imigração, globalização e desconfiança das elites, mas disputando eleições." },
    ],
    timeline: [["1899", "Fundação da Action Française."], ["1932", "Fundação da Ação Integralista Brasileira, movimento nacionalista inspirado no fascismo europeu."], ["1937", "O integralismo é posto na ilegalidade pelo Estado Novo."]],
  },
  fascismo: {
    figures: [
      { slug: "mussolini", name: "Benito Mussolini", years: "1883–1945", caption: "Fundou o fascismo em 1919, chegou ao poder após a Marcha sobre Roma (1922) e governou a Itália como ditador até 1943, aliado de Hitler na Segunda Guerra.", credit: { author: "autor desconhecido", license: PD, page: "https://commons.wikimedia.org/wiki/File:Mussolini_mezzobusto.jpg" } },
      { slug: "hitler", name: "Adolf Hitler", years: "1889–1945", caption: "Líder do Partido Nazista, governou a Alemanha de 1933 a 1945. Seu regime iniciou a Segunda Guerra Mundial e realizou o Holocausto, o assassinato de 6 milhões de judeus e de milhões de outras vítimas.", credit: { author: "Heinrich Hoffmann (Bundesarchiv)", license: "CC BY-SA 3.0 DE", page: "https://commons.wikimedia.org/wiki/File:Hitler_portrait_crop_(cropped)(2).jpg" } },
    ],
    chapters: [
      { title: "A Itália em crise", text: "A Itália saiu da Primeira Guerra entre os vencedores, mas com a sensação de ter sido \"traída\" nos acordos de paz. Vieram desemprego, inflação, greves e ocupações de fábricas (1919–1920). Proprietários e boa parte da classe média tinham medo de uma revolução comunista." },
      { title: "Como Mussolini chegou ao poder", text: "Mussolini, ex-socialista, criou milícias, os camisas-negras, que atacavam sindicatos e socialistas e se apresentavam como defensoras da ordem. Em 1922, a Marcha sobre Roma pressionou o rei, que o nomeou primeiro-ministro. Em poucos anos, proibiu os outros partidos, controlou a imprensa e se tornou o \"Duce\"." },
      { title: "A Alemanha humilhada", text: "Na Alemanha, a derrota na guerra e o Tratado de Versalhes (1919) trouxeram perda de territórios e dívidas enormes. Em 1923, a hiperinflação destruiu as economias das famílias; em 1932, depois da crise de 1929, havia cerca de 6 milhões de desempregados. Os governos da República de Weimar caíam um atrás do outro." },
      { title: "Como Hitler conquistou o povo", text: "Hitler era um orador carismático. Prometia empregos, ordem e devolver o orgulho nacional, e culpava os judeus, os comunistas e o Tratado de Versalhes pelos problemas do país. Com propaganda moderna, comícios gigantes e milícias nas ruas, o Partido Nazista virou o maior do parlamento em 1932, com cerca de 37% dos votos, sem nunca ter maioria em eleições livres." },
      { title: "Da nomeação à ditadura", text: "Em janeiro de 1933, Hitler foi nomeado chanceler por políticos conservadores que achavam que poderiam controlá-lo. Um mês depois, o incêndio do parlamento serviu de pretexto para suspender direitos, e a Lei de Plenos Poderes deu a ele o poder de governar sem o parlamento. Em meses, partidos e sindicatos foram fechados e a imprensa, controlada. Obras públicas e o rearmamento reduziram o desemprego, o que aumentou o apoio ao regime." },
      { title: "Guerra e Holocausto", text: "A perseguição aos judeus foi crescendo: Leis de Nuremberg (1935), Noite dos Cristais (1938) e, durante a guerra, o extermínio em campos de concentração. A Segunda Guerra terminou em 1945 com a derrota da Alemanha e da Itália, e líderes nazistas foram julgados em Nuremberg." },
    ],
    timeline: [["1919", "Mussolini funda o movimento fascista."], ["1922", "Marcha sobre Roma: Mussolini chega ao poder."], ["1933", "Hitler chega ao poder na Alemanha."], ["1939–1945", "Segunda Guerra Mundial e Holocausto."], ["1944", "A Força Expedicionária Brasileira desembarca na Itália."], ["1945", "Derrota da Alemanha nazista e da Itália fascista."]],
  },
};
