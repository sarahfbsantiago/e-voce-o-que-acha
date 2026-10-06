// =====================================================
// PERGUNTAS
// Para adicionar uma pergunta, copie um bloco e ajuste.
// Cada opção tem um valor em "pontos" que será somado.
// Perguntas "invertidas" (onde "sim" é negativo) basta
// trocar os pontos das opções, como na pergunta 2.
// =====================================================

const PERGUNTAS = [
  {
    id: 1,
    texto: "Você acredita no potencial dos brasileiros na área de tecnologia, inovação e empreendedorismo?",
    opcoes: [
      { texto: "Sim, totalmente", pontos: 3 },
      { texto: "Em parte", pontos: 2 },
      { texto: "Pouco", pontos: 1 },
      { texto: "Não", pontos: 0 }
    ]
  },
  {
    id: 2,
    texto: "Você costuma mentir com constância sobre assuntos graves que podem impactar a vida das pessoas?",
    opcoes: [
      { texto: "Nunca", pontos: 3 },
      { texto: "Raramente", pontos: 2 },
      { texto: "Às vezes", pontos: 1 },
      { texto: "Com frequência", pontos: 0 }
    ]
  },
  {
    id: 3,
    texto: "Você acredita que todos têm o direito a uma alimentação saudável?",
    opcoes: [
      { texto: "Sim, totalmente", pontos: 3 },
      { texto: "Em parte", pontos: 2 },
      { texto: "Pouco", pontos: 1 },
      { texto: "Não", pontos: 0 }
    ]
  },
  {
    id: 4,
    texto: "Você acredita que seria legal todos terem o direito mínimo garantido por lei de ter estudo de qualidade, saúde e moradia digna?",
    opcoes: [
      { texto: "Sim, totalmente", pontos: 3 },
      { texto: "Em parte", pontos: 2 },
      { texto: "Pouco", pontos: 1 },
      { texto: "Não", pontos: 0 }
    ]
  }
];
