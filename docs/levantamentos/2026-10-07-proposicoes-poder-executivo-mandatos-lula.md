# Proposições do Poder Executivo nos mandatos de Lula — 07/10/2026

Levantamento feito para corrigir a comparação de quantidade de projetos entre os candidatos.
As pizzas do relatório usavam, para Lula, uma seleção de 49 atos de grande alcance e, para
Flávio Bolsonaro, todas as 66 proposições de autoria dele no Senado, o que dava a impressão
errada de que Lula havia proposto menos.

## Fonte

Câmara dos Deputados, Dados Abertos, arquivos anuais:

- `https://dadosabertos.camara.leg.br/arquivos/proposicoes/csv/proposicoes-AAAA.csv`
- `https://dadosabertos.camara.leg.br/arquivos/proposicoesAutores/csv/proposicoesAutores-AAAA.csv`

Anos: 2003 a 2010 e 2023 a 2026. Cruzamento por `idProposicao`. Critério de autoria:
`codTipoAutor = 30000` ("Órgão do Poder Executivo"; autores "Poder Executivo" e
"Presidência da República"). Período: data de apresentação entre 01/01/2003 e 31/12/2010
e entre 01/01/2023 e 06/10/2026. Cada proposição contada uma vez.

## Resultado

| Tipo | Quantidade |
|---|---|
| PL (projeto de lei) | 455 |
| PLP (projeto de lei complementar) | 34 |
| PEC (proposta de emenda à Constituição) | 18 |
| MPV (medida provisória) | 660 |
| PLN (projeto de lei do Congresso, orçamento) | 136 |
| **Total** | **1.303** |

Para comparação, Flávio Bolsonaro, como autor principal no Senado (Dados Abertos do Senado,
06/10/2026): 66 proposições, das quais 53 projetos de lei.

## Observações

- Proposições do Poder Executivo são institucionais: saem da Presidência da República durante
  o mandato. São atribuídas ao governo Lula, não a uma autoria pessoal.
- Mandatos diferentes: chefe do Executivo e senador têm funções diferentes. A comparação de
  quantidade não mede qualidade nem resultado.
- Como deputado constituinte (1987–1991), Lula teve 12 proposições de autoria na Câmara, 7 delas
  projetos de lei.
