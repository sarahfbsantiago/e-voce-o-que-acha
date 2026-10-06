# Você decide

> **Você decide. Nós organizamos as evidências.**

Aplicação web brasileira de educação política e comparação de evidências sobre os candidatos **Lula** e **Flávio Bolsonaro** no segundo turno das eleições presidenciais de 2026.

**O projeto não utiliza um algoritmo secreto para determinar em quem uma pessoa deve votar. As respostas do usuário servem para selecionar, ordenar e contextualizar evidências públicas relacionadas aos assuntos que ele próprio declarou relevantes.**

## O que o site faz

1. Permite responder 52 perguntas em linguagem simples sobre políticas públicas e valores políticos, em 12 sessões (temas). Toda pergunta tem a opção "Não sei".
2. Permite declarar quanto cada tema é importante para a pessoa.
3. Mostra, por tema: sua resposta, a proposta de cada candidato, o que cada um já fez, o que é apenas proposta, o que já está em vigor, a fonte original, o link e a data da informação, com classificação (proposta, posição, atuação, resultado observado) e força documental (A–D).
4. Dá acesso ao histórico documentado conforme o cargo ocupado (métricas de Executivo vs. parlamentar).
5. Abre a fonte original de qualquer afirmação ("Ver fonte original") e explica por que ela aparece ("Por que estou vendo isso?").
6. Publica a metodologia completa, versionada, com histórico de alterações.
7. Apresenta a trajetória de cada candidato: experiência profissional, cargos públicos, linha do tempo, leis e projetos com link, e um quadro de principais realizações, propostas e posições por tema, tudo com "Como sabemos disso?".
8. No relatório, compara cada resposta com a posição documentada de cada candidato (igual / parecida / diferente), indica por tema quem ficou mais perto, conta os temas e mostra a proporção de concordância por candidato, sempre com a fórmula à vista. Silêncio do candidato conta como "diferente" para ele e nunca vira posição atribuída.
9. Coleta, apenas com consentimento, estatísticas anônimas agregadas e uma avaliação anônima da pesquisa (nota 1–5 e se ajudou na decisão).

## O que o site não faz

- Não recomenda candidato nem voto.
- Não produz nota, ranking nem "melhor candidato". As porcentagens do relatório são proporções de concordância com documentos publicados, explicadas com a conta aberta.
- Não pondera respostas pela importância dos temas; a importância só ordena o relatório e a pizza das áreas.
- Não atribui causalidade automática a indicadores observados durante um governo.
- Não atribui a um candidato posições de partido, familiares, aliados ou apoiadores.
- Não preenche lacunas: quando falta evidência, diz "não se posicionou nas fontes oficiais" e conta a pergunta como diferente, igualmente para os dois candidatos.
- Não coleta nome, email, documento, IP em campo de aplicação, user agent, fingerprint ou dados de navegação.
- Não trata as estatísticas da pesquisa como pesquisa eleitoral nem extrapola para "os brasileiros".

## Stack

Next.js 16 (App Router, Server Components, Route Handlers, Server Actions) · TypeScript · React 19 · Tailwind CSS 4 · PostgreSQL · Prisma 6 · Zod · Vitest. Fonte: Roboto Mono (next/font).

## Instalação

```bash
npm install            # roda `prisma generate` no postinstall
cp .env.example .env   # ajuste DATABASE_URL e ADMIN_TOKEN
npm run dev            # http://localhost:3000
```

### Dois modos de execução

| Modo | Quando | O que funciona |
|------|--------|----------------|
| `static` | sem `DATABASE_URL` (ou `DATA_SOURCE=static`) | Todo o site e a API de conteúdo, lendo de `src/data`. Posições, evidências e resumos ficam vazios. Envio de estatísticas e painel admin respondem 503. |
| `prisma` | com `DATABASE_URL` | Conteúdo lido do banco (após seed), estatísticas anônimas, avaliação e painel admin. |

### Banco de dados

```bash
docker compose up -d           # PostgreSQL 16 local
npm run db:migrate             # aplica prisma/migrations
npm run db:seed                # candidatos, temas, perguntas, fontes, protocolos, metodologia
```

O seed **não** insere posições de candidatos, evidências nem resumos de programa. Esses registros nascem vazios e só entram após revisão humana de documentos oficiais (ver *Processo de inclusão de fontes*).

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | não | Conexão PostgreSQL. Sem ela, modo estático. |
| `DATA_SOURCE` | não | Força `static` ou `prisma`. |
| `ADMIN_TOKEN` | não | Token (≥16 caracteres) do painel `/admin/research`. Sem ele o painel fica desativado. |

### Rascunhos para revisão (levantamentos)

```bash
npm run db:import-drafts   # importa prisma/drafts/*.json e docs/levantamentos/*.csv como DRAFT
```

Os levantamentos de 06/10/2026 estão em `docs/levantamentos/`: conferência de fontes e
trajetória, resumos dos programas de 2026 por tema (a partir dos PDFs do TSE) e a lista de
projetos de Flávio Bolsonaro no Senado. Tudo entra no banco como `DRAFT` e **não aparece no
site** até um revisor mudar para `APPROVED` e `PUBLISHED` (por exemplo via `npm run db:studio`),
registrando `AuditLog`.

### Testes e qualidade

```bash
npm test          # vitest: regras metodológicas e API
npm run typecheck
npm run lint
npm run build
```

## Arquitetura

```
prisma/
  schema.prisma            # modelos, enums, relações (sem campo de pontuação)
  migrations/              # SQL versionado
  seed.ts                  # seed sem posições de candidatos
src/
  app/                     # páginas (App Router) e API
    api/                   # GET públicos; POST anônimos; GET admin protegido
    questionario/          # intro + consentimento → perguntas → prioridades
    relatorio/             # "Seu mapa de prioridades" (sem pontuação)
    metodologia/ fontes/ privacidade/ como-funciona/
    admin/                 # login por token + painel agregado privado
  components/              # UI acessível, cards simétricos, legendas por forma+texto
  data/                    # CONTEÚDO CANÔNICO: temas, perguntas, notas de contexto,
                           # argumentos, SOURCE_REGISTRY, protocolos, metodologia
  domain/                  # regras: ordenação, indicador por questão, publicação,
                           # agregação, neutralidade, ordem aleatória de candidatos
  ingestion/               # SourceAdapter + adapters (Câmara, Senado, TSE) → DRAFT
  lib/                     # repositório (static|prisma), validação Zod, auth admin
  store/                   # sessão no navegador (localStorage)
tests/                     # domain/ e api/
```

### Fluxo do usuário

Página inicial → Como funciona / Metodologia → Consentimento estatístico opcional → 52 perguntas em 12 sessões, sem nomes de candidatos → Importância de cada tema (ao final de cada sessão) → **Seu mapa de prioridades** (com a proximidade documentada por tema) → **Compare as propostas** (por tema: sua resposta, proposta de cada candidato, o que cada um já fez, o que é apenas proposta, o que já está em vigor, fonte, link e data) → **Conheça melhor os candidatos** (trajetória, cargos, experiência, programa 2026 por tema, comparação de experiência, pontos centrais, links oficiais) → **Conheça os programas completos** → Avaliação anônima da pesquisa → mensagem final: "Este site não decide seu voto. A decisão é sua."

### Modelo de dados (resumo)

`Candidate`, `Topic`, `Question`, `QuestionOption`, `ContextNote`, `ArgumentSet`, `Source`, `Evidence`, `CandidatePosition` (→ N `Evidence` via `CandidatePositionEvidence`), `LegislativeAction`, `PublicPolicy`, `Indicator` (nunca é posição), `ProgramSummary`, `EvidenceReview` (revisão cega), `MethodologyVersion`, `ResearchProtocol`, `ChangeLog`, `AuditLog`, `RawDocument`, `LlmClassification`, `SurveySubmission`, `QuestionAggregate`, `SurveyFeedback`.

### API

| Rota | Descrição |
|------|-----------|
| `GET /api/questions`, `GET /api/questions/[id]`, `GET /api/questions/[id]/evidence` | Perguntas, contexto, protocolo; evidências publicadas por candidato com estado explícito de ausência |
| `GET /api/topics` | Temas |
| `GET /api/candidates`, `GET /api/candidates/[id]`, `GET /api/candidates/[id]/positions` | Candidatos e posições publicadas por pergunta |
| `GET /api/sources`, `GET /api/sources/[id]` | Registro de fontes (filtros `institution`, `legend`, `type`) |
| `GET /api/methodology`, `GET /api/methodology/history` | Metodologia vigente (1.1.0) e todas as versões, inclusive a 1.0.0 |
| `GET /api/research/protocols?questionId=` | Protocolos de pesquisa |
| `POST /api/survey/submissions` | Envio anônimo (schema estrito; rejeita qualquer campo identificável) |
| `POST /api/survey/feedback` | Avaliação anônima da pesquisa |
| `GET /api/admin/research[?format=csv]` | Agregados privados (token) |

Previstos para o painel administrativo futuro: POST de evidência, revisão, aprovação e importação automatizada. O workflow é `DRAFT → PENDING_REVIEW → APPROVED → PUBLISHED | REJECTED`; só `PUBLISHED` aparece ao público.

## Metodologia (resumo)

A versão completa está em `/metodologia` e em `src/data/methodology.ts`.

- **Escala interna** (2, 1, 0, −1, −2) só para gráficos do próprio usuário.
- **Importância dos temas** só ordena o relatório.
- **Indicadores por questão**: semelhante / parcialmente semelhante / diferente / evidência insuficiente. Nunca consolidados.
- **Hierarquia de evidências** A (primária direta) → D (comentário). Nenhuma posição baseada só em D.
- **Classificações**: PROPOSTA, POSICAO, ATUACAO, RESULTADO_OBSERVADO. Nunca misturadas.
- **Contexto legal vigente** antes de perguntas sensíveis (IR 2026 — Lei 15.270/2025; apostas — MP 1.394/2026; jornada; aborto; segurança federativa).

## Processo de inclusão de fontes e evidências

1. Consultar o `ResearchProtocol` da questão (termos, fontes, período, critérios) **antes** de pesquisar.
2. Localizar na ordem: documento original → base pública → fonte primária do candidato → organismo técnico → imprensa profissional.
3. Registrar a fonte em `Source` (URL, instituição, tipo, datas, verificação do link, hash/arquivo quando possível).
4. Criar `Evidence` como `DRAFT` com trecho original, classificação, força e critério.
5. **Revisão cega** (`EvidenceReview`): o revisor vê texto, fonte e tema sem o candidato; registra classificação, versão e motivo.
6. Aprovar (`APPROVED`) e, só então, publicar (`PUBLISHED`). Cada mudança gera `AuditLog`.
7. `CandidatePosition` só pode ser publicada com ≥1 evidência aprovada e não apenas de nível D (`src/domain/publication.ts`).
8. Mudança de posição → cronologia, sem palavras como "mentira" ou "contradição".
9. Ingestão automática (`src/ingestion`) e classificação por LLM **nunca** publicam: produzem `DRAFT` com prompt, modelo, versão, resposta e confiança registrados.

## Regras de neutralidade verificadas em código

`tests/domain/neutrality-scan.test.ts` varre `src/` em busca de frases e identificadores de ranking/recomendação. `src/domain/publication.ts` rejeita resumos com linguagem proibida. `src/domain/comparison.ts` exporta uma única função, por questão. `src/domain/aggregates.ts` não possui função de intenção de voto. A ordem esquerda/direita dos candidatos é sorteada por sessão e os cards têm o mesmo espaço visual.

## Privacidade e logs

A aplicação não lê IP nem user agent. Se a infraestrutura de hospedagem (proxy, CDN, provedor) gerar logs de acesso com IP, eles ficam fora da aplicação; configure a menor retenção possível e documente-a aqui ao implantar.

## Estado atual e TODOs

- [x] Programas de 2026 obtidos pelos Dados Abertos do TSE (`proposta_governo_2026_BR.zip`); o portal do TSE segue bloqueando acesso automatizado, mas o CDN oficial de dados abertos responde.
- [ ] **TODO(ingestão)** Implementar `SenadoAdapter` e `TseAdapter`; concluir `CamaraAdapter` (autores, tramitações, votos) e persistência de `RawDocument`.
- [ ] **TODO(revisão)** Painel administrativo de revisão cega e endpoints POST (evidência, revisão, aprovação).
- [ ] **TODO(revisão)** Revisar os 54 `ProgramSummary` e as 66 `LegislativeAction` em DRAFT (`docs/levantamentos/`) e publicar os aprovados. Até lá, o relatório mostra os estados explícitos de ausência.
- [ ] **TODO(conteúdo)** Cadastrar `Evidence` e `CandidatePosition` por pergunta, com revisão cega.
- [ ] Verificação manual pendente: ADPF 54 (STF, teor da decisão), Biblioteca da Presidência, OCDE, atuação de Flávio Bolsonaro na ALERJ (2003–2019) e candidatura de Lula ao Governo de SP em 1982.

## Como contribuir

- Toda alteração de pergunta, critério ou classificação exige nova entrada em `METHODOLOGY_VERSIONS` (nunca apague versões anteriores).
- Nenhum fato político entra no banco sem `Source` consultável. O conhecimento do modelo de linguagem não é fonte.
- Rode `npm test` antes de abrir PR: os testes de neutralidade e publicação são obrigatórios.
- Projeto anterior (quiz estático) preservado em `legacy-static/` apenas como referência histórica.
