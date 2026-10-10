/**
 * Textos das páginas do site (editáveis no admin, aba Textos do site). Este arquivo é o estado inicial (versão 1);
 * depois disso, o que vale é a versão publicada no banco. Marcadores: {perguntas} e {temas} viram as contagens atuais.
 */
export type TextBlock = { t: "p"; text: string } | { t: "ul" | "ol"; items: string[] };

export interface SiteTexts {
  home: { headline: string; card1Title: string; card1Text: string; card2Title: string; card2Text: string; notice: string };
  startCta: { titleHome: string; titleOther: string; subtitle: string };
  footer: { about: string; bottom: string };
  comoFunciona: { lead: string; steps: { title: string; text: string }[] };
  metodologia: { title: string; sections: { id: string; title: string; blocks: TextBlock[] }[] };
  report: { finalMessage: string; footerIntro: string };
}

export const SITE_TEXTS: SiteTexts = {
  "home": {
    "headline": "Descubra sua ideologia política e compare suas ideias com as propostas dos candidatos.",
    "card1Title": "Sua ideologia:",
    "card1Text": "veja onde suas respostas te colocam na régua política, do comunismo ao fascismo, e o que essa corrente defende.",
    "card2Title": "Os candidatos:",
    "card2Text": "compare, tema a tema, suas prioridades com propostas e registros públicos de cada um.",
    "notice": "Este site não diz em quem você deve votar."
  },
  "startCta": {
    "titleHome": "Pronto para ver seu perfil?",
    "titleOther": "Ainda não respondeu?",
    "subtitle": "{perguntas} perguntas, sem nome de candidato, com as fontes no final. Você decide."
  },
  "footer": {
    "about": "Este site não diz em quem você deve votar. Ele organiza evidências públicas para você tirar a própria conclusão.",
    "bottom": "Projeto independente e sem fins eleitorais. Todas as afirmações sobre candidatos apontam para a fonte original."
  },
  "comoFunciona": {
    "lead": "Oito passos, sem recomendação de voto e com a conta aberta.",
    "steps": [
      {
        "title": "Você responde",
        "text": "{perguntas} perguntas em linguagem simples sobre políticas públicas e valores políticos, divididas em 5 seções com {temas} temas. Cada seção começa perguntando o quanto aqueles temas importam para você. Toda pergunta tem a opção “Não sei”. Os nomes dos candidatos ficam ocultos durante as perguntas, e nenhuma cor partidária é usada."
      },
      {
        "title": "Você declara prioridades",
        "text": "Ao final de cada sessão, você informa quanto aquele tema importa para você. Essa informação serve exclusivamente para ordenar o seu relatório."
      },
      {
        "title": "Nós organizamos as evidências",
        "text": "Para cada pergunta, comparamos sua resposta com a posição documentada de cada candidato: igual, parecida ou diferente. Se o candidato não se posicionou nas fontes oficiais, a pergunta conta como diferente para ele, e o site diz isso. Depois, você conhece melhor os candidatos: trajetória, cargos, o que fizeram e o que prometem, com link para cada documento."
      },
      {
        "title": "Você consulta o histórico",
        "text": "Atuação legislativa e políticas executadas são apresentadas conforme o cargo que o candidato ocupou. Um parlamentar não é penalizado por não ter competências executivas."
      },
      {
        "title": "Você vê a diferença",
        "text": "Proposta eleitoral, declaração, atuação legislativa, política executada e indicador estatístico são sempre separados e nunca misturados."
      },
      {
        "title": "Você abre a fonte",
        "text": "Cada afirmação sobre um candidato aponta para o documento original. No relatório, cada pergunta mostra qual documento sustenta a posição, com data e link. Na trajetória, o botão “Como sabemos disso?” mostra a fonte, a instituição, o trecho utilizado e o tipo de evidência. O catálogo de fontes abre a origem de cada uma."
      },
      {
        "title": "Você entende o sistema",
        "text": "A metodologia é pública: perguntas, critérios de inclusão e exclusão, hierarquia de evidências, tratamento de lacunas e histórico de alterações."
      },
      {
        "title": "Você decide",
        "text": "O site não recomenda candidato nem monta ranking. Mostra, com a conta aberta, quanto suas respostas concordam com cada um e em quantos temas cada um ficou mais perto. A decisão é sua."
      }
    ]
  },
  "metodologia": {
    "title": "Como este site funciona",
    "sections": [
      {
        "id": "objetivo",
        "title": "Objetivo",
        "blocks": [
          {
            "t": "p",
            "text": "O site ajuda você a comparar suas opiniões com as posições e ações documentadas dos candidatos."
          },
          {
            "t": "p",
            "text": "Você responde {perguntas} perguntas sobre políticas públicas e informa quais temas são mais importantes para você."
          },
          {
            "t": "p",
            "text": "Depois, o site mostra onde suas respostas são iguais, parecidas ou diferentes das posições de cada candidato."
          },
          {
            "t": "p",
            "text": "O site não recomenda voto, não dá nota aos candidatos e não cria ranking."
          },
          {
            "t": "p",
            "text": "**Você decide. Nós organizamos as evidências.**"
          }
        ]
      },
      {
        "id": "principios",
        "title": "Princípios",
        "blocks": [
          {
            "t": "p",
            "text": "Os mesmos critérios são usados para todos os candidatos."
          },
          {
            "t": "p",
            "text": "Não usamos opiniões de familiares, partidos, aliados ou apoiadores como posição do candidato."
          },
          {
            "t": "p",
            "text": "Também diferenciamos claramente:"
          },
          {
            "t": "ul",
            "items": [
              "O que o candidato promete",
              "O que ele afirma defender",
              "O que ele realmente fez",
              "O que já está em vigor",
              "O que ainda é apenas projeto ou proposta"
            ]
          }
        ]
      },
      {
        "id": "perguntas",
        "title": "Perguntas",
        "blocks": [
          {
            "t": "p",
            "text": "São {perguntas} perguntas divididas em 5 seções, com {temas} temas."
          },
          {
            "t": "p",
            "text": "Os nomes dos candidatos não aparecem durante o questionário."
          },
          {
            "t": "p",
            "text": "Todas as perguntas possuem a opção “Não sei”."
          }
        ]
      },
      {
        "id": "importancia",
        "title": "Importância dos temas",
        "blocks": [
          {
            "t": "p",
            "text": "No início de cada seção, você informa o quanto aqueles temas importam para você:"
          },
          {
            "t": "ul",
            "items": [
              "Não importa",
              "Importa pouco",
              "Importa",
              "Importa muito",
              "É uma das coisas mais importantes para mim"
            ]
          },
          {
            "t": "p",
            "text": "Essa informação serve para organizar seu relatório."
          },
          {
            "t": "p",
            "text": "Ela não aumenta nem diminui a pontuação de nenhum candidato."
          }
        ]
      },
      {
        "id": "comparacao",
        "title": "Como suas respostas são comparadas",
        "blocks": [
          {
            "t": "p",
            "text": "Para cada pergunta, o site compara sua resposta com a posição documentada de cada candidato."
          },
          {
            "t": "p",
            "text": "O resultado pode ser:"
          },
          {
            "t": "ul",
            "items": [
              "Igual a você",
              "Parecido com você",
              "Diferente de você"
            ]
          },
          {
            "t": "p",
            "text": "Se não houver uma posição documentada do candidato, o site informa isso claramente."
          },
          {
            "t": "p",
            "text": "Nesse caso, a pergunta conta como diferente."
          },
          {
            "t": "p",
            "text": "A mesma regra vale para todos."
          }
        ]
      },
      {
        "id": "temas",
        "title": "Quem ficou mais próximo em cada tema",
        "blocks": [
          {
            "t": "p",
            "text": "Para cada tema, o site calcula quantas respostas ficaram iguais ou parecidas com as posições de cada candidato."
          },
          {
            "t": "p",
            "text": "Resposta igual vale 1 ponto."
          },
          {
            "t": "p",
            "text": "Resposta parecida vale meio ponto."
          },
          {
            "t": "p",
            "text": "Depois, o total é dividido pelo número de perguntas respondidas naquele tema."
          },
          {
            "t": "p",
            "text": "O candidato com maior resultado aparece como mais próximo naquele tema."
          },
          {
            "t": "p",
            "text": "Em caso de empate, nenhum candidato é indicado."
          }
        ]
      },
      {
        "id": "resultado",
        "title": "Resultado geral",
        "blocks": [
          {
            "t": "p",
            "text": "O relatório mostra:"
          },
          {
            "t": "ul",
            "items": [
              "Em quantos temas cada candidato ficou mais próximo",
              "A proporção de respostas iguais ou parecidas com cada candidato",
              "A comparação de cada pergunta",
              "As fontes usadas"
            ]
          },
          {
            "t": "p",
            "text": "Isso não é uma nota eleitoral nem uma recomendação de voto."
          },
          {
            "t": "p",
            "text": "É apenas uma comparação entre suas respostas e documentos públicos."
          }
        ]
      },
      {
        "id": "fontes",
        "title": "Fontes",
        "blocks": [
          {
            "t": "p",
            "text": "Sempre damos preferência a documentos oficiais."
          },
          {
            "t": "p",
            "text": "A ordem de prioridade é:"
          },
          {
            "t": "ol",
            "items": [
              "Documento original",
              "Base pública responsável pelo documento",
              "Fonte oficial do candidato",
              "Órgãos e instituições técnicas",
              "Jornalismo profissional"
            ]
          },
          {
            "t": "p",
            "text": "Entre as principais fontes estão:"
          },
          {
            "t": "ul",
            "items": [
              "TSE",
              "Planalto",
              "Câmara dos Deputados",
              "Senado Federal",
              "Gov.br"
            ]
          },
          {
            "t": "p",
            "text": "Quando existe um documento oficial, damos preferência a ele em vez de uma reportagem."
          }
        ]
      },
      {
        "id": "evidencias",
        "title": "Tipos de evidência",
        "blocks": [
          {
            "t": "p",
            "text": "As informações podem ser classificadas como:"
          },
          {
            "t": "ul",
            "items": [
              "Proposta, aquilo que o candidato pretende fazer",
              "Posição, aquilo que o candidato diz defender",
              "Atuação, aquilo que ele efetivamente fez, votou, apresentou, sancionou ou decidiu",
              "Resultado observado, dados registrados durante determinado período"
            ]
          },
          {
            "t": "p",
            "text": "Um resultado ocorrido durante um governo não é automaticamente atribuído ao presidente como causa."
          }
        ]
      },
      {
        "id": "lacunas",
        "title": "Quando não há informação",
        "blocks": [
          {
            "t": "p",
            "text": "Se não encontrarmos uma posição suficientemente documentada, o site informa:"
          },
          {
            "t": "p",
            "text": "“Não se posicionou nas fontes oficiais.”"
          },
          {
            "t": "p",
            "text": "Não tentamos descobrir a posição do candidato com base em ideologia, partido ou opinião de terceiros."
          }
        ]
      },
      {
        "id": "mudanca",
        "title": "Mudança de posição",
        "blocks": [
          {
            "t": "p",
            "text": "Se um candidato mudou de posição ao longo do tempo, o site mostra a sequência dos acontecimentos."
          },
          {
            "t": "p",
            "text": "A posição mais recente é usada na comparação, mas as anteriores continuam disponíveis para consulta."
          }
        ]
      },
      {
        "id": "privacidade",
        "title": "Privacidade",
        "blocks": [
          {
            "t": "p",
            "text": "Para participar da pesquisa, é necessário aceitar a Política de Privacidade e o uso anônimo das respostas para fins de pesquisa."
          },
          {
            "t": "p",
            "text": "Podem ser usados de forma anônima:"
          },
          {
            "t": "ul",
            "items": [
              "Suas respostas",
              "O resultado da comparação",
              "Sua avaliação da pesquisa",
              "Sua resposta sobre a pesquisa ter ajudado na decisão"
            ]
          },
          {
            "t": "p",
            "text": "Faixa etária e região são opcionais."
          },
          {
            "t": "p",
            "text": "Os dados enviados são anônimos e não são usados para identificar você."
          }
        ]
      },
      {
        "id": "historico",
        "title": "Transparência",
        "blocks": [
          {
            "t": "p",
            "text": "Toda mudança importante na metodologia é registrada."
          },
          {
            "t": "p",
            "text": "Versões antigas continuam documentadas."
          },
          {
            "t": "p",
            "text": "A metodologia atual é a versão 1.3.0, vigente desde 7 de outubro de 2026."
          }
        ]
      },
      {
        "id": "resumo",
        "title": "Em resumo",
        "blocks": [
          {
            "t": "p",
            "text": "São {perguntas} perguntas."
          },
          {
            "t": "p",
            "text": "Os candidatos ficam ocultos durante o questionário."
          },
          {
            "t": "p",
            "text": "As posições são baseadas principalmente em fontes oficiais."
          },
          {
            "t": "p",
            "text": "Você pode abrir as fontes e conferir as informações."
          },
          {
            "t": "p",
            "text": "Não existe nota, ranking ou indicação de voto."
          },
          {
            "t": "p",
            "text": "Somente dados, fontes e comparação."
          }
        ]
      }
    ]
  },
  "report": {
    "finalMessage": "Você viu o que cada candidato propõe, parte de sua trajetória pública e os documentos utilizados para produzir este resumo. Os links acima permitem conferir as informações diretamente nas fontes originais. Este site não decide seu voto. A decisão é sua.",
    "footerIntro": "O que você disse que importa, tema a tema, e com quem suas respostas ficaram mais próximas nos temas em que há posições publicadas. Nada aqui vira nota ou ranking."
  }
};


/** Troca {perguntas} e {temas} pelas contagens atuais. */
export function fillCounts(text: string, counts: { questions: number; topics: number }): string {
  return text.replaceAll("{perguntas}", String(counts.questions)).replaceAll("{temas}", String(counts.topics));
}
