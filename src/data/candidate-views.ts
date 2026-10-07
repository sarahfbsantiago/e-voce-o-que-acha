/**
 * "Visão" de cada candidato, mostrada no relatório abaixo da barra de porcentagem.
 * Texto escrito e revisado pela responsável pelo projeto (revisão humana, 07/10/2026).
 * Editar só com nova revisão humana, exatamente como ela pedir.
 */
/** Parágrafo, lista ou item com título em negrito e descrição. */
export type ViewBlock = string | { list: string[] } | { title: string; text: string };

export interface CandidateViewSection {
  /** Tema do questionário a que o trecho se refere (usado em "Entender por quê"). */
  topicId: string;
  title: string;
  blocks: ViewBlock[];
}

export interface CandidateView {
  candidateId: string;
  label: string;
  sections: CandidateViewSection[];
  sourceIds: string[];
}

export const CANDIDATE_VIEWS: CandidateView[] = [
  {
    candidateId: "flavio-bolsonaro",
    label: "Visão Flávio",
    sourceIds: ["folha-flavio-plano-governo-stf-2026", "folha-flavio-imposto-folha-2026", "uol-flavio-escala-6x1-2026"],
    sections: [
      { topicId: "t01", title: "1. Economia e impostos", blocks: [
        "Flávio defende que o governo gaste menos dinheiro, cobre menos impostos de grandes empresas e deixe mais atividades nas mãos de empresas privadas. Ele também quer vender algumas empresas públicas e reduzir o tamanho do governo.",
      ] },
      { topicId: "t02", title: "2. Trabalho, emprego e jornada", blocks: [
        "Flávio defende regras de trabalho mais flexíveis. Ele acredita que empresas e trabalhadores devem ter mais liberdade para combinar salário, horário e jornada. Também quer diminuir os custos das empresas para contratar jovens e pessoas mais velhas. Ou seja, os gastos que uma empresa tem quando contrata um funcionário além do salário. Por exemplo, podem entrar nessa conta:",
        { list: ["contribuição para o INSS", "FGTS", "férias", "décimo terceiro salário", "benefícios", "seguros", "custos administrativos ligados à contratação"] },
        "Então, quando Flávio fala em reduzir o custo para a empresa contratar, normalmente significa diminuir alguns impostos, contribuições ou encargos pagos pela empresa.",
      ] },
      { topicId: "t09", title: "3. Infraestrutura, indústria e desenvolvimento", blocks: [
        "Flávio defende investimentos em estradas, ferrovias, portos, aeroportos e energia.",
        "Mas ele quer que grande parte desses investimentos seja feita por empresas privadas.",
        "Também defende facilitar investimentos, concessões e grandes obras.",
      ] },
      { topicId: "t03", title: "4. Saúde", blocks: [
        "Flávio diz que pretende ajustar o SUS. Ele defende parceria com o setor privado.",
        "Também promete melhorar alguns serviços de saúde.",
      ] },
      { topicId: "t04", title: "5. Educação, ciência e pesquisa", blocks: [
        "Flávio defende uma educação mais focada em aprendizado, profissão e mercado de trabalho. Ele apoia escolas cívico militares, educação financeira e empreendedorismo.",
        "Também quer que pesquisas das universidades tenham mais ligação com empresas, tecnologia e produção.",
      ] },
      { topicId: "t05", title: "6. Programas sociais, pobreza e desigualdade", blocks: [
        "Flávio afirma que esses programas devem ajudar a pessoa a conseguir emprego e aumentar sua própria renda. Propõe maior fiscalização e burocracia para implementação. A ideia dele é que o benefício seja uma ajuda até a pessoa conseguir emprego.",
      ] },
      { topicId: "t06", title: "6. Segurança pública e crime organizado", blocks: [
        "Flávio defende leis duras contra criminosos. Ele quer aumentar penas, diminuir a maior idade penal para 16 anos, construir mais presídios e dificultar a saída antecipada de presos Também quer usar mais câmeras, reconhecimento facial e tecnologia de vigilância. Ele defende ações mais duras contra facções criminosas e contra o dinheiro dessas organizações.",
      ] },
      { topicId: "t07", title: "7. Armas", blocks: [
        "Flávio defende facilitar o acesso a armas para pessoas que querem se proteger.",
        "Ele critica algumas das regras mais rígidas criadas pelo governo Lula. Também tende a defender regras mais favoráveis para pessoas que possuem armas legalmente.",
      ] },
      { topicId: "t07", title: "8. Drogas", blocks: [
        "Flávio é contra a liberação e a descriminalização das drogas.",
        "Ele defende que o porte de drogas continue sendo tratado como crime.",
      ] },
      { topicId: "t07", title: "9. Apostas", blocks: [
        "Flávio é contra proibir completamente as empresas de apostas.",
        "Ele defende que elas possam continuar funcionando dentro de regras.",
      ] },
      { topicId: "t08", title: "10. Meio ambiente e energia", blocks: [
        "Flávio defende facilitar projetos de mineração, petróleo, gás e outras atividades econômicas. Ele acredita que o Brasil deve continuar usando petróleo e outras fontes de energia fóssil e flexibilizar o processo de licença ambiental para exploração de órgaos reguladores tais como o IBAMA. A posição dele é tentar juntar proteção ambiental com exploração econômica.",
      ] },
      { topicId: "t10", title: "11. Tecnologia e autonomia do Brasil", blocks: [
        "Busca uma relação tecnológica e econômica mais próxima com os Estados Unidos. Defende que o Brasil tenha mais autonomia porém não deixe de importar do exterior.",
      ] },
      { topicId: "t11", title: "12. Relações internacionais", blocks: [
        "Flávio defende uma aproximação maior do Brasil com os Estados Unidos e Israel.",
        "Ele critica algumas posições do Brasil dentro do Brics. Também quer dar mais liberdade para o Brasil fazer acordos comerciais com outros países. A política externa dele seria mais próxima dos Estados Unidos do que a de Lula.",
      ] },
      { topicId: "t12", title: "13. Direitos, democracia e instituições", blocks: [
        "Flávio diz que quer mudar algumas regras do STF e constituição. Ele também defende mudanças na forma como algumas decisões judiciais são tomadas, diminuir a capacidade do STF de controlar outros Poderes. Ele também coloca a liberdade de expressão como uma das principais bandeiras de seu programa.",
      ] },
    ],
  },
  {
    candidateId: "lula",
    label: "Visão Lula",
    sourceIds: ["tse-proposta-governo-2026-lula", "govbr-programas", "lei-15270-2025", "mpv-1394-2026", "lei-15358-2026", "sri-mercosul-ue-2026", "planalto-cop30-2025", "planalto-brics-2025", "planalto-alianca-fome-2024", "mdic-redata-2026", "serpro-nuvem-brasileira-2026"],
    // Texto escrito e revisado pela responsável (revisão humana, 07/10/2026).
    sections: [
      { topicId: "t01", title: "Economia e trabalho — Economia e impostos", blocks: [
        { title: "Isenção do Imposto de Renda até R$ 5 mil", text: "Aprovada em 2025 e aplicada a partir de 2026. Zera o imposto devido para rendimentos mensais de até R$ 5 mil e cria redução gradual até R$ 7.350." },
        { title: "Tributação de rendas muito altas", text: "Defende tornar o sistema tributário mais progressivo, cobrando proporcionalmente mais de rendas muito elevadas e reduzindo a carga sobre rendas menores." },
        { title: "Reforma tributária do consumo", text: "Apoia a implementação do novo sistema de tributação do consumo, com CBS, IBS, cesta básica isenta e cashback para famílias de menor renda." },
        { title: "Desenrola Brasil", text: "Criado para permitir renegociação de dívidas de consumidores e facilitar a recuperação do acesso ao crédito; nova modalidade em 2026." },
        { title: "Política de valorização do salário mínimo", text: "Retomada em 2023 para permitir reajustes acima da inflação de acordo com as regras estabelecidas em lei." },
        { title: "Economia e contas públicas", text: "Defende manter o arcabouço fiscal, controlar o crescimento das despesas e buscar redução dos juros sem abandonar as principais políticas sociais." },
      ] },
      { topicId: "t02", title: "Economia e trabalho — Trabalho, emprego e jornada", blocks: [
        { title: "Fim da escala 6x1", text: "Passou a apoiar a aprovação do fim da escala 6x1 e a redução da jornada para 40 horas semanais sem redução salarial. A mudança ainda depende do Congresso." },
        { title: "Igualdade salarial entre mulheres e homens", text: "Projeto enviado pelo governo e transformado na Lei nº 14.611/2023. Criou mecanismos de transparência e fiscalização para combater diferenças salariais injustificadas." },
        { title: "Trabalhadores de aplicativos", text: "Defende criar proteção social e previdenciária para trabalhadores de plataformas, com regras sobre remuneração e transparência dos algoritmos." },
        { title: "Qualificação profissional e ensino técnico", text: "A expansão dos Institutos Federais e da educação profissional é parte da política de qualificação para o mercado de trabalho." },
      ] },
      { topicId: "t09", title: "Economia e trabalho — Infraestrutura, indústria e desenvolvimento", blocks: [
        { title: "PAC", text: "Criado no segundo governo Lula para concentrar investimentos em infraestrutura." },
        { title: "Novo PAC", text: "Retomado em 2023. Reúne investimentos públicos e privados em transportes, energia, saneamento, saúde, educação, conectividade e infraestrutura urbana." },
        { title: "Minha Casa, Minha Vida", text: "Criado em 2009 e retomado em 2023. Financia e subsidia moradias, principalmente para famílias de menor renda." },
        { title: "Nova Indústria Brasil", text: "Política de reindustrialização voltada a inovação, tecnologia, saúde, defesa, transição energética e aumento da produção nacional." },
        { title: "Luz para Todos", text: "Criado em 2003 para levar energia elétrica a comunidades rurais e regiões sem acesso à eletricidade." },
        { title: "Saneamento e transporte público", text: "Propõe universalizar água tratada e esgoto e ampliar o transporte coletivo de alta capacidade com eletrificação das frotas." },
      ] },
      { topicId: "t03", title: "Social: saúde, educação e renda — Saúde", blocks: [
        { title: "Farmácia Popular", text: "Criado no primeiro governo e depois ampliado. Oferece medicamentos gratuitos ou subsidiados; propõe incluir exames." },
        { title: "Brasil Sorridente", text: "Criado para ampliar o atendimento odontológico dentro do SUS." },
        { title: "Mais Médicos", text: "Retomado e ampliado no terceiro mandato para levar profissionais a regiões com menor cobertura médica." },
        { title: "Agora Tem Especialistas", text: "Programa de redução das filas para consultas, exames e procedimentos especializados no SUS, com mutirões, unidades móveis, telessaúde e ampliação da oferta." },
        { title: "Prontuário eletrônico único", text: "Propõe integrar os dados de saúde e permitir marcações e acompanhamento digital, com inteligência artificial para organizar filas por gravidade." },
        { title: "Produção nacional de medicamentos e vacinas", text: "Defende aumentar a produção brasileira de vacinas, medicamentos, insulina, hemoderivados e insumos estratégicos." },
      ] },
      { topicId: "t04", title: "Social: saúde, educação e renda — Educação, ciência e pesquisa", blocks: [
        { title: "Prouni", text: "Criado em 2005. Bolsas integrais e parciais em instituições privadas para estudantes que atendam aos critérios do programa." },
        { title: "Institutos Federais", text: "Criados pela Lei nº 11.892/2008. Rede nacional de educação técnica, tecnológica e superior; o programa prevê mais 111 unidades em 106 municípios." },
        { title: "Expansão das universidades federais", text: "Os primeiros governos ampliaram universidades, cursos, vagas e campi, com o Reuni; propõe nova fase de interiorização." },
        { title: "Pé-de-Meia", text: "Criado em 2024. Incentivo financeiro a estudantes de baixa renda do ensino médio público, condicionado a matrícula, frequência e conclusão." },
        { title: "Escola em Tempo Integral", text: "Criado em 2023 para financiar a expansão de matrículas em jornada integral." },
        { title: "Alfabetização e internet nas escolas", text: "Propõe 80% das crianças alfabetizadas na idade certa e conexão de qualidade em todas as escolas públicas." },
        { title: "Plano Brasileiro de Inteligência Artificial", text: "Inclui investimento em pesquisa, formação de profissionais e infraestrutura científica para IA." },
      ] },
      { topicId: "t05", title: "Social: saúde, educação e renda — Programas sociais, pobreza e desigualdade", blocks: [
        { title: "Fome Zero", text: "Lançado em 2003 como estratégia nacional de combate à fome e à insegurança alimentar." },
        { title: "Bolsa Família", text: "Criado em 2004 e retomado em nova versão em 2023. Transferência de renda com regras e acompanhamento das famílias." },
        { title: "Regras do Bolsa Família", text: "As famílias cumprem compromissos de educação e saúde: frequência escolar, vacinação, acompanhamento de crianças e de gestantes." },
        { title: "Brasil Sem Fome", text: "Criado em 2023 para articular transferência de renda, alimentação, assistência social e outras políticas contra a fome e a pobreza." },
        { title: "Política Nacional de Cuidados", text: "Projeto enviado pelo governo e transformado em lei em 2024: crianças, idosos, pessoas com deficiência, quem precisa de cuidados e trabalhadores do cuidado." },
      ] },
      { topicId: "t06", title: "Segurança — Segurança pública e crime organizado", blocks: [
        { title: "Lei Antifacção", text: "Projeto elaborado pelo governo e sancionado em 2026. Novos instrumentos jurídicos contra organizações criminosas, milícias e grupos paramilitares." },
        { title: "Brasil Contra o Crime Organizado", text: "Criado em 2026. Integra inteligência, investigação e forças de segurança da União e dos estados, com foco também na estrutura financeira das organizações criminosas." },
        { title: "Combate ao dinheiro das facções", text: "A estratégia inclui bloqueio de patrimônio, investigação financeira e combate à lavagem de dinheiro." },
        { title: "Sistema penitenciário", text: "Modernização de presídios estratégicos e maior isolamento de lideranças criminosas." },
        { title: "PEC da Segurança Pública", text: "Proposta enviada pelo governo para ampliar a coordenação nacional da segurança e integrar União, estados e municípios. Ainda depende do Congresso." },
        { title: "Câmeras corporais e policiamento de proximidade", text: "Defende ampliar o uso de câmeras corporais e o policiamento de proximidade." },
      ] },
      { topicId: "t07", title: "Segurança — Armas, drogas e apostas", blocks: [
        { title: "Maior controle de armas", text: "Em 2023 o governo estabeleceu novas regras para compra, posse, porte, registro e comercialização de armas e munições, inclusive para CACs." },
        { title: "Combate ao tráfico de armas", text: "É um dos eixos do programa Brasil Contra o Crime Organizado." },
        { title: "Bets", text: "Depois de um período de regulamentação, editou em setembro de 2026 a medida provisória que proibiu exploração, oferta, intermediação e publicidade das apostas de quota fixa." },
      ] },
      { topicId: "t08", title: "Ambiente e tecnologia — Meio ambiente e energia", blocks: [
        { title: "Fundo Amazônia", text: "Criado em 2008 e reativado em 2023. Financia combate ao desmatamento, fiscalização, restauração, proteção de povos indígenas e desenvolvimento sustentável." },
        { title: "PPCDAm", text: "Retomada do Plano de Prevenção e Controle do Desmatamento na Amazônia: fiscalização, monitoramento, ordenamento territorial e atividades sustentáveis." },
        { title: "Desmatamento líquido zero até 2030", text: "Meta reafirmada pelo programa de governo, com monitoramento por satélite e inteligência artificial." },
        { title: "Metas climáticas e Plano Clima", text: "Defende reduzir as emissões líquidas brasileiras entre 59% e 67% até 2035 e preparar o país para eventos extremos." },
        { title: "Mercado de carbono", text: "Sancionou em 2024 a lei do Sistema Brasileiro de Comércio de Emissões e defende implementá-lo." },
        { title: "Fiscalização, queimadas e Ibama", text: "Recompôs as regras de infrações e sanções ambientais e amplia recursos para fiscalização, brigadas e tecnologia contra queimadas, garimpo ilegal e desmatamento." },
        { title: "Demarcação de terras indígenas", text: "O terceiro governo retomou homologações de terras indígenas e defende demarcação e titulação de territórios quilombolas." },
        { title: "Transição energética", text: "Sancionou o marco do hidrogênio de baixa emissão, o Combustível do Futuro e a lei das eólicas offshore; defende ampliar renováveis mantendo petróleo e gás durante a transição." },
        { title: "COP30 em Belém", text: "Sediou e abriu a COP30 em novembro de 2025, reiterando o compromisso com desmatamento zero até 2030." },
      ] },
      { topicId: "t10", title: "Ambiente e tecnologia — Tecnologia e autonomia do Brasil", blocks: [
        { title: "Plano Brasileiro de Inteligência Artificial", text: "Prevê cerca de R$ 23 bilhões em quatro anos para IA, infraestrutura, formação profissional, serviços públicos e inovação." },
        { title: "Supercomputador nacional e modelos em português", text: "Infraestrutura de alta capacidade com energia renovável e modelos de IA treinados com dados nacionais em língua portuguesa." },
        { title: "Governo digital", text: "Ampliação de serviços públicos digitais, uso de dados e IA na administração federal; Política Nacional de Educação Digital (2023)." },
        { title: "5G e conectividade", text: "Expansão de fibra óptica, redes móveis e inclusão digital, com prioridade para Norte, Nordeste e periferias." },
        { title: "Soberania digital e defesa cibernética", text: "Desenvolver tecnologias estratégicas no Brasil, proteger infraestrutura crítica e reduzir a dependência externa em áreas críticas." },
        { title: "Data centers", text: "Atrair centros de processamento de dados com energia renovável e contrapartidas de desenvolvimento tecnológico nacional." },
        { title: "Produção nacional de tecnologia", text: "A Nova Indústria Brasil busca aumentar a produção nacional em saúde, defesa, IA, semicondutores, minerais estratégicos e transição energética." },
      ] },
      { topicId: "t11", title: "Instituições e mundo — Relações internacionais", blocks: [
        { title: "Fortalecimento do Mercosul", text: "Defende aprofundar a integração econômica, comercial, energética e política da América do Sul; sancionou em 2026 o acordo Mercosul–União Europeia." },
        { title: "BRICS", text: "Presidiu o BRICS em 2025 e sediou a Cúpula do Rio; defende ampliar a cooperação e o peso dos países emergentes nas instituições internacionais." },
        { title: "Relações com diferentes blocos", text: "Mantém relações simultâneas com Estados Unidos, China, União Europeia, América Latina, África, Oriente Médio e Ásia, sem alinhamento exclusivo." },
        { title: "Reforma da ONU", text: "Defende a reforma do Conselho de Segurança e maior participação dos países em desenvolvimento; abre o Debate Geral da Assembleia Geral da ONU todos os anos." },
        { title: "Aliança Global contra a Fome e a Pobreza", text: "Lançada na Cúpula do G20 no Rio, em 2024, com 148 membros fundadores, entre eles 82 países." },
      ] },
      { topicId: "t12", title: "Instituições e mundo — Direitos, democracia e instituições", blocks: [
        { title: "Lei Maria da Penha", text: "Sancionada em 2006. Mecanismos específicos de prevenção e combate à violência doméstica e familiar contra mulheres." },
        { title: "Pacto Nacional de Prevenção aos Feminicídios", text: "Criado em 2023 para integrar políticas federais, estaduais e municipais de prevenção da violência contra mulheres." },
        { title: "História e cultura afro-brasileira nas escolas", text: "Sancionou em 2003 a lei que tornou obrigatório o ensino de história e cultura afro-brasileira." },
        { title: "Igualdade racial, cotas, indígenas e quilombolas", text: "Defende manter e ampliar ações afirmativas, demarcação de terras indígenas e titulação de territórios quilombolas." },
        { title: "Pessoas com deficiência", text: "Mantém políticas de inclusão e garantia de direitos." },
        { title: "Regulação das plataformas digitais", text: "Defende regras de transparência e responsabilidade para grandes plataformas, inclusive sobre conteúdos ilegais e algoritmos." },
        { title: "Combate à corrupção, emendas e reforma política", text: "Independência das instituições de investigação, transparência sobre emendas parlamentares e orçamento, mudanças no sistema político e eleitoral." },
      ] },
    ],
  },
];
