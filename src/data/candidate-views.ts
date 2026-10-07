/**
 * "Visão" de cada candidato, mostrada no relatório abaixo da barra de porcentagem.
 * Texto escrito e revisado pela responsável pelo projeto (revisão humana, 07/10/2026).
 * Editar só com nova revisão humana, exatamente como ela pedir.
 */
export type ViewBlock = string | { list: string[] };

export interface CandidateViewSection {
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
      { title: "1. Economia e impostos", blocks: [
        "Flávio defende que o governo gaste menos dinheiro, cobre menos impostos de grandes empresas e deixe mais atividades nas mãos de empresas privadas. Ele também quer vender algumas empresas públicas e reduzir o tamanho do governo.",
      ] },
      { title: "2. Trabalho, emprego e jornada", blocks: [
        "Flávio defende regras de trabalho mais flexíveis. Ele acredita que empresas e trabalhadores devem ter mais liberdade para combinar salário, horário e jornada. Também quer diminuir os custos das empresas para contratar jovens e pessoas mais velhas. Ou seja, os gastos que uma empresa tem quando contrata um funcionário além do salário. Por exemplo, podem entrar nessa conta:",
        { list: ["contribuição para o INSS", "FGTS", "férias", "décimo terceiro salário", "benefícios", "seguros", "custos administrativos ligados à contratação"] },
        "Então, quando Flávio fala em reduzir o custo para a empresa contratar, normalmente significa diminuir alguns impostos, contribuições ou encargos pagos pela empresa.",
      ] },
      { title: "3. Infraestrutura, indústria e desenvolvimento", blocks: [
        "Flávio defende investimentos em estradas, ferrovias, portos, aeroportos e energia.",
        "Mas ele quer que grande parte desses investimentos seja feita por empresas privadas.",
        "Também defende facilitar investimentos, concessões e grandes obras.",
      ] },
      { title: "4. Saúde", blocks: [
        "Flávio diz que pretende ajustar o SUS. Ele defende parceria com o setor privado.",
        "Também promete melhorar alguns serviços de saúde.",
      ] },
      { title: "5. Educação, ciência e pesquisa", blocks: [
        "Flávio defende uma educação mais focada em aprendizado, profissão e mercado de trabalho. Ele apoia escolas cívico militares, educação financeira e empreendedorismo.",
        "Também quer que pesquisas das universidades tenham mais ligação com empresas, tecnologia e produção.",
      ] },
      { title: "6. Programas sociais, pobreza e desigualdade", blocks: [
        "Flávio afirma que esses programas devem ajudar a pessoa a conseguir emprego e aumentar sua própria renda. Propõe maior fiscalização e burocracia para implementação. A ideia dele é que o benefício seja uma ajuda até a pessoa conseguir emprego.",
      ] },
      { title: "6. Segurança pública e crime organizado", blocks: [
        "Flávio defende leis duras contra criminosos. Ele quer aumentar penas, diminuir a maior idade penal para 16 anos, construir mais presídios e dificultar a saída antecipada de presos Também quer usar mais câmeras, reconhecimento facial e tecnologia de vigilância. Ele defende ações mais duras contra facções criminosas e contra o dinheiro dessas organizações.",
      ] },
      { title: "7. Armas", blocks: [
        "Flávio defende facilitar o acesso a armas para pessoas que querem se proteger.",
        "Ele critica algumas das regras mais rígidas criadas pelo governo Lula. Também tende a defender regras mais favoráveis para pessoas que possuem armas legalmente.",
      ] },
      { title: "8. Drogas", blocks: [
        "Flávio é contra a liberação e a descriminalização das drogas.",
        "Ele defende que o porte de drogas continue sendo tratado como crime.",
      ] },
      { title: "9. Apostas", blocks: [
        "Flávio é contra proibir completamente as empresas de apostas.",
        "Ele defende que elas possam continuar funcionando dentro de regras.",
      ] },
      { title: "10. Meio ambiente e energia", blocks: [
        "Flávio defende facilitar projetos de mineração, petróleo, gás e outras atividades econômicas. Ele acredita que o Brasil deve continuar usando petróleo e outras fontes de energia fóssil e flexibilizar o processo de licença ambiental para exploração de órgaos reguladores tais como o IBAMA. A posição dele é tentar juntar proteção ambiental com exploração econômica.",
      ] },
      { title: "11. Tecnologia e autonomia do Brasil", blocks: [
        "Busca uma relação tecnológica e econômica mais próxima com os Estados Unidos. Defende que o Brasil tenha mais autonomia porém não deixe de importar do exterior.",
      ] },
      { title: "12. Relações internacionais", blocks: [
        "Flávio defende uma aproximação maior do Brasil com os Estados Unidos e Israel.",
        "Ele critica algumas posições do Brasil dentro do Brics. Também quer dar mais liberdade para o Brasil fazer acordos comerciais com outros países. A política externa dele seria mais próxima dos Estados Unidos do que a de Lula.",
      ] },
      { title: "13. Direitos, democracia e instituições", blocks: [
        "Flávio diz que quer mudar algumas regras do STF e constituição. Ele também defende mudanças na forma como algumas decisões judiciais são tomadas, diminuir a capacidade do STF de controlar outros Poderes. Ele também coloca a liberdade de expressão como uma das principais bandeiras de seu programa.",
      ] },
    ],
  },
  {
    candidateId: "lula",
    label: "Visão Lula",
    sourceIds: [],
    // Texto a ser enviado pela responsável (revisão humana).
    sections: [],
  },
];
