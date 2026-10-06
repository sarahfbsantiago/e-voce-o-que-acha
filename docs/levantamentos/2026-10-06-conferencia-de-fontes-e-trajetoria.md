# Conferência de fontes e levantamento de trajetória — 06/10/2026

Este documento registra o que foi conferido diretamente nas bases oficiais, o que
continua pendente e os dados brutos obtidos. Nada aqui é publicado automaticamente
no site: serve de base para a revisão humana prevista na metodologia (versão 1.1.0).

## 1. Fontes conferidas

| Fonte | Como foi conferida | Resultado |
|---|---|---|
| Lei nº 15.270/2025 (Planalto) | Texto baixado e lido | Tabela de redução do IR mensal a partir de jan/2026, faixa "até R$ 5.000,00" confirmada |
| MP nº 1.394/2026 (Planalto) | Texto baixado e lido | Ementa confirmada: proíbe exploração, oferta, intermediação e publicidade de loterias de apostas de quota fixa; altera a Lei 14.790/2023 |
| Leis 13.756/2018 e 14.790/2023, Constituição, Código Penal | HTTP 200 no Planalto | Acessíveis |
| Receita Federal — tabelas IR 2026 | Texto lido | Menciona redução decrescente por faixa até zerar |
| Portal da Transparência — origem dos dados | Texto lido (precisa de cabeçalho de navegador) | Confirma "integra e apresenta dados de diversos sistemas", downloads abertos e API |
| STF — ADPF 54 | Página acessível com cabeçalho de navegador | Classe ADPF e relator Min. Marco Aurélio confirmados; o teor da decisão carrega por script, **conferir no navegador** |
| TSE — Dados Abertos (candidatos-2026) | Dataset e arquivos baixados | `consulta_cand_2026.zip` e `proposta_governo_2026_BR.zip` obtidos do CDN oficial |
| TSE — portal e DivulgaCandContas | HTTP 403 | Bloqueiam acesso automatizado; usar os Dados Abertos acima |
| Senado — Dados Abertos (senador 5894) | API JSON | Mandatos, autorias, relatorias, votações, comissões obtidos |
| Câmara — Dados Abertos (deputado 139289) | API JSON | Registro de Lula na 48ª Legislatura obtido |
| Planalto — Biografia do Presidente | Texto lido | Datas de trajetória confirmadas |
| Biblioteca da Presidência | HTTP 200, conteúdo por script | **Conferir no navegador** |
| ALERJ | Portal sem lista de ex-deputados | Mandatos confirmados pelo TSE; atuação na ALERJ **pendente** |
| OCDE | HTTP 403 | Pendente |

**Atenção:** um identificador da Câmara inicialmente cogitado (74646) pertence a outro
deputado (Aécio Neves). O registro correto de Lula é **139289**, obtido por busca nominal
na API com `idLegislatura=48`.

## 2. Trajetória — fatos confirmados

### Lula
| Fato | Fonte | Status |
|---|---|---|
| Nascimento em 27/10/1945, Garanhuns (PE) | Planalto (biografia); Câmara (API) | confirmado |
| Fundação do PT em 10/02/1980 | Planalto (biografia) | confirmado |
| Candidatura ao Governo de SP em 1982 | — | **não localizado** nas fontes consultadas |
| Deputado federal constituinte por SP, 48ª Legislatura (01/02/1987–31/01/1991), PT | Câmara (API); Planalto | confirmado |
| Candidato à Presidência em 1989, 1994 e 1998 | Planalto (biografia) | confirmado |
| Eleito presidente em 2002 (2º turno) | TSE consulta_cand_2002; Planalto | confirmado |
| Reeleito em 2006 | Planalto; TSE consulta_cand_2006 | confirmado |
| Candidatura registrada em 2018, situação INAPTO | TSE consulta_cand_2018 | confirmado (registro) |
| Eleito presidente em 2022 (2º turno) | TSE consulta_cand_2022 | confirmado |
| Posse em 01/01/2023; exerce o mandato em 2026 | Planalto (biografia) | confirmado |
| Candidato em 2026: nº 13, PT, SQ_CANDIDATO 280002542548 | TSE consulta_cand_2026 | confirmado |

Atuação como deputado (Câmara, API): 12 proposições de autoria na 48ª Legislatura
(PLs sobre transferência de imóveis do SFH, recuperação de perdas salariais, regulamentação
do FGTS, correção de benefícios e planos da Previdência; requerimentos de informação).

### Flávio Bolsonaro
| Fato | Fonte | Status |
|---|---|---|
| Nascimento em 30/04/1981; nome civil Flávio Nantes Bolsonaro | Senado (API) | confirmado |
| Eleito deputado estadual (RJ) em 2002 (PPB) | TSE consulta_cand_2002 | confirmado |
| Reeleito em 2006 (PP), 2010 (PP) e 2014 (PP, eleito por QP) | TSE consulta_cand_2006/2010/2014 | confirmado |
| Eleito senador (RJ) em 2018 (PSL), eleição de 07/10/2018 | TSE consulta_cand_2018 | confirmado |
| Mandato titular no Senado: 01/02/2019 a 31/01/2027 (56ª e 57ª legislaturas) | Senado (API) | confirmado |
| Filiação ao PL em 30/11/2021 (antes, Patriota em 2021) | Senado (API) | confirmado |
| Candidato em 2026: nº 22, PL, SQ_CANDIDATO 280002551544 | TSE consulta_cand_2026 | confirmado |
| Detalhamento da atuação na ALERJ (segurança, sistema penitenciário, defesa civil) | — | **pendente** (portal da ALERJ não expõe histórico de ex-deputados) |

Atuação no Senado (API, 06/10/2026): 445 autorias (186 como autor principal; destas, 66
projetos: 53 PL, 4 PEC, 3 PLP, 5 PDL, 1 PRS), 166 relatorias, 1.142 votações registradas,
66 participações em comissões. A lista dos 66 projetos está em
`2026-10-06-flavio-bolsonaro-projetos-autor-principal-senado.csv`, com link para cada
matéria. Agrupamento preliminar por palavras-chave da ementa (sujeito a revisão humana):
segurança pública/direito penal 36; direitos e instituições 10; saúde/decretos legislativos 10;
economia/tributos/trabalho 9; outros 10. **Autoria não equivale a aprovação**: a situação de
cada matéria deve ser conferida no link antes de qualquer publicação.

## 3. Programas de governo 2026 (TSE)

Arquivos em `proposta_governo_2026_BR.zip` (Dados Abertos do TSE, dataset atualizado em 22/07/2026):

| Candidato | Arquivo | Páginas | Título interno |
|---|---|---|---|
| Lula | 2026BR280002542548_01.pdf | 84 | "Programa de Governo — Diretrizes para o Programa de Transformação do Brasil" (13 eixos) |
| Flávio Bolsonaro | 2026BR280002551544_01.pdf | 76 | "Diretrizes Plano de Governo Flávio Bolsonaro 2027-2030" (9 blocos: Brasil sem Medo, Brasil por Elas, Brasil sem Fila, Brasil Mais Barato, Brasil que Prepara, Brasil que Prospera, Brasil que Cresce, Brasil que Cumpre a Constituição, Brasil que Não Volta Atrás) |

Os resumos por tema, com etiqueta (Manter/Ampliar/Criar/Mudar/Reduzir/Não há proposta clara),
trechos citados e páginas, estão em `2026-10-06-programas-2026-resumos.md` e em
`prisma/drafts/program-summaries.draft.json` (status DRAFT). Ambos os documentos contêm
afirmações das próprias candidaturas sobre resultados de governos anteriores; essas
afirmações **não** foram usadas como fatos, apenas as propostas.

## 4. Pendências para revisão humana

1. Conferir no navegador: ADPF 54 (STF), Biblioteca da Presidência (mandatos 2003–2010).
2. Localizar na ALERJ o histórico de proposições de Flávio Bolsonaro (2003–2019).
3. Verificar a situação de tramitação de cada um dos 66 projetos antes de registrá-los como `LegislativeAction` com status.
4. Revisar e aprovar/rejeitar cada `ProgramSummary` em DRAFT; só então publicar.
5. Candidatura de Lula ao Governo de SP em 1982: localizar fonte oficial (TSE anterior a 1994 não está nos Dados Abertos conferidos).
