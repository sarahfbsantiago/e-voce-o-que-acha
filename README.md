# Você decide

> **Você decide. Nós organizamos as evidências.**

**No ar:** https://voce-decide-production.up.railway.app

## Sobre o quiz

O **Você decide** é um questionário sobre políticas públicas para o segundo turno presidencial de 2026, entre **Lula** e **Flávio Bolsonaro**. A pessoa responde sem ver os nomes dos candidatos. No fim, o relatório mostra com quem as respostas mais concordam, tema a tema, com a fonte de cada afirmação e a conta aberta.

O site não recomenda voto, não monta ranking e não usa algoritmo secreto.

## Objetivos

- Ajudar cada pessoa a entender as próprias prioridades e compará-las com o que os candidatos propõem e fizeram.
- Mostrar só informação verificável, com link para o documento original.
- Aplicar os mesmos critérios aos dois candidatos.
- Deixar a decisão com a pessoa: nada vira nota, recomendação ou intenção de voto.

## Metodologia

- **Neutralidade na coleta.** Nomes e cores partidárias ficam ocultos durante as perguntas. As alternativas aparecem da mais afirmativa para a mais negativa, com "Não sei" por último.
- **Posições documentadas.** Cada candidato tem uma posição por pergunta, com trecho literal, data, link e classificação: proposta, posição ou atuação.
- **Fatos antes de promessas.** A explicação de cada pergunta cita primeiro o que foi feito (lei, decreto, projeto) e depois o que foi prometido.
- **Mudança de posição.** Vale a evidência mais recente, e o relatório mostra a linha do tempo.
- **Cargo considerado.** Um parlamentar é avaliado pelo que um parlamentar faz; nunca é penalizado por não ter poderes de presidente.
- **Revisão humana.** Nenhuma posição aparece no site sem ser publicada no painel de administração (`/admin/posicoes`), com registro de auditoria.
- **Versões públicas.** Metodologia na versão 1.2.0, com histórico completo em `/metodologia` e em `src/data/methodology.ts`.
- **Privacidade.** As respostas ficam no navegador. Só com consentimento seguem como estatística anônima, sem nome, email, documento ou IP.

## Perguntas

São 52 perguntas em 12 temas, todas com a opção "Não sei". Ao fim de cada tema, a pessoa diz quanto ele importa para ela.

| Tema | Perguntas |
|---|---|
| Economia e impostos | 4 |
| Trabalho, emprego e jornada | 4 |
| Saúde | 4 |
| Educação, ciência e pesquisa | 4 |
| Programas sociais, pobreza e desigualdade | 4 |
| Segurança pública e crime organizado | 4 |
| Armas, drogas e apostas | 5 |
| Meio ambiente e energia | 4 |
| Infraestrutura, indústria e desenvolvimento | 4 |
| Tecnologia e autonomia do Brasil | 5 |
| Relações internacionais | 5 |
| Direitos, democracia e instituições | 5 |

No relatório, os 12 temas aparecem em cinco áreas: **Economia e trabalho**; **Social, saúde, educação e renda**; **Segurança**; **Ambiente e tecnologia**; **Instituições e mundo**.

O texto completo das perguntas e alternativas está em `src/data/questions.ts` e na página `/metodologia`.

## Algoritmo matemático

Implementado em `src/domain/comparison.ts`, `src/domain/theme-proximity.ts` e `src/domain/profile-proximity.ts`, com testes em `tests/domain/`.

**1. Escala.** Respostas e posições usam a mesma régua. "Não sei" fica fora de toda conta.

```
Resposta:  Concordo = 2 · Concordo em parte = 1 · Discordo em parte = −1 · Discordo = −2
Posição:   apoia = 2 · apoia em parte = 1 · neutro = 0 · opõe-se em parte = −1 · opõe-se = −2
```

**2. Por pergunta.** A distância entre a resposta e a posição define o resultado.

```
distância = |resposta − posição|
0 = igual · 1 = parecido · 2 ou mais = diferente
```

Nas perguntas de escolha entre itens, a mesma alternativa conta como igual, a vizinha como parecida e qualquer outra como diferente.

**3. Regra do silêncio.** Se o candidato não tem posição documentada numa pergunta respondida, ela conta como **diferente** para ele. O site nunca inventa uma posição, e calar não ajuda ninguém.

**4. Por tema.** Fica mais perto quem tiver o maior score. Empate não indica ninguém. Se nenhum dos dois tem posição no tema, ele aparece como "evidência insuficiente".

```
score = (iguais + 0,5 × parecidas) ÷ perguntas respondidas no tema
```

**5. Perfil.** O site conta em quantos temas cada candidato ficou mais perto e mostra duas proporções.

```
concordância = (iguais + 0,5 × parecidas) ÷ todas as perguntas respondidas
temas        = temas em que ficou mais perto ÷ temas comparáveis
```

**6. Fora da conta.** A importância que a pessoa dá a cada tema nunca multiplica nada: só ordena o relatório e desenha a pizza da pessoa. As pizzas dos candidatos contam os atos de cada um por área (Lula: leis, decretos, medidas provisórias e programas; Flávio: proposições de sua autoria no Senado) e também não entram no cálculo.

**7. Painel de administração.** `/admin/research` refaz a mesma conta para cada questionário enviado e mostra quantos ficaram mais perto de cada candidato, em porcentagem, além de empates, casos sem comparação e a concordância média. Isso descreve concordância com documentos, não intenção de voto.

## Fontes

63 fontes cadastradas, todas com link (`src/data/source-registry.ts`; catálogo pesquisável em `/fontes`).

- **Programas de governo de 2026** registrados no TSE, com a página do PDF de cada citação.
- **Portal da Legislação do Planalto:** leis, decretos e medidas provisórias.
- **Dados Abertos do Senado:** projetos de autoria, relatorias e votações.
- **Dados Abertos da Câmara dos Deputados:** proposições, autoria e votações.
- **Páginas oficiais do gov.br** sobre programas federais.
- **Biografia oficial do Planalto e registros de candidatura do TSE:** trajetória, ocupação e escolaridade.
- **Imprensa profissional:** só como declaração entre aspas e com link; nunca define sozinha a posição de um candidato.

---

## Para desenvolvedores

### Stack

Next.js 16 (App Router, Server Components, Route Handlers, Server Actions) · TypeScript · React 19 · Tailwind CSS 4 · PostgreSQL · Prisma 6 · Zod · Vitest. Fonte: Roboto Mono (next/font).

### Instalação

```bash
npm install            # roda `prisma generate` no postinstall
cp .env.example .env   # ajuste DATABASE_URL e ADMIN_TOKEN
npm run dev            # http://localhost:3000
```

#### Dois modos de execução

| Modo | Quando | O que funciona |
|------|--------|----------------|
| `static` | sem `DATABASE_URL` (ou `DATA_SOURCE=static`) | Todo o site e a API de conteúdo, lendo de `src/data`. Posições, evidências e resumos ficam vazios. Envio de estatísticas e painel admin respondem 503. |
| `prisma` | com `DATABASE_URL` | Conteúdo lido do banco (após seed), estatísticas anônimas, avaliação e painel admin. |

#### Banco de dados

```bash
docker compose up -d           # PostgreSQL 16 local
npm run db:migrate             # aplica prisma/migrations
npm run db:seed                # candidatos, temas, perguntas, fontes, protocolos, metodologia
```

O seed **não** insere posições de candidatos, evidências nem resumos de programa. Eles entram com `npm run db:import-drafts` como `DRAFT` e só aparecem no site depois de publicados em `/admin/posicoes` (ver *Rascunhos para revisão*).

#### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | não | Conexão PostgreSQL. Sem ela, modo estático. |
| `DATA_SOURCE` | não | Força `static` ou `prisma`. |
| `ADMIN_TOKEN` | não | Token (≥16 caracteres) dos painéis `/admin/research` (agregados) e `/admin/posicoes` (publicação de posições). Sem ele os painéis ficam desativados. |
| `NEXT_PUBLIC_SITE_URL` | não | URL pública (ex.: `https://voce-decide-production.up.railway.app`) usada nas tags de compartilhamento. |

#### Rascunhos para revisão (levantamentos)

```bash
npm run db:import-drafts   # importa prisma/drafts/*.json e docs/levantamentos/*.csv como DRAFT
```

`prisma/drafts/positions.draft.json` traz as 104 posições (52 perguntas × 2 candidatos) com suas
evidências, classificadas a partir dos programas de 2026 registrados no TSE e de leis, decretos,
medidas provisórias e projetos em fontes oficiais. `docs/levantamentos/` guarda a conferência de
fontes e trajetória, os resumos dos programas por tema e a lista de projetos de Flávio Bolsonaro
no Senado. Tudo entra no banco como `DRAFT` e **não aparece no site** até ser publicado em
`/admin/posicoes` (publicar, rejeitar, despublicar ou publicar tudo, sempre com `AuditLog`).
Com `IMPORT_UPDATE_PUBLISHED=1`, a reimportação atualiza posições já publicadas mantendo o status;
itens já revisados nunca são sobrescritos.

#### Testes e qualidade

```bash
npm test          # vitest: regras metodológicas e API
npm run typecheck
npm run lint
npm run build
```

### Arquitetura

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

#### Fluxo do usuário

Página inicial → Como funciona / Metodologia → Consentimento estatístico ("Sim" pré-marcado, "Continuar sem enviar" a um toque) → 52 perguntas em 12 sessões, uma por tela, sem nomes de candidatos → Importância de cada tema (ao final de cada sessão) → **Relatório**: pizza do seu perfil por área · pizzas do que cada candidato fez por área · **Qual candidato está mais próximo do seu perfil** (cinco áreas com os temas dentro; diálogo por pergunta com a alternativa de cada candidato, o documento, a data e o link; conta aberta) · como você respondeu por tema · trajetória de cada candidato (experiência, cargos, leis e projetos, quadro por área e tema, "Como sabemos disso?") · fontes usadas · avaliação anônima → mensagem final: "Este site não decide seu voto. A decisão é sua." → recomeçar do zero ou baixar em PDF.

#### Modelo de dados (resumo)

`Candidate`, `Topic`, `Question`, `QuestionOption`, `ContextNote`, `ArgumentSet`, `Source`, `Evidence`, `CandidatePosition` (→ N `Evidence` via `CandidatePositionEvidence`), `LegislativeAction`, `PublicPolicy`, `Indicator` (nunca é posição), `ProgramSummary`, `EvidenceReview` (revisão cega), `MethodologyVersion`, `ResearchProtocol`, `ChangeLog`, `AuditLog`, `RawDocument`, `LlmClassification`, `SurveySubmission`, `QuestionAggregate`, `SurveyFeedback`.

#### API

| Rota | Descrição |
|------|-----------|
| `GET /api/questions`, `GET /api/questions/[id]`, `GET /api/questions/[id]/evidence` | Perguntas, contexto, protocolo; evidências publicadas por candidato com estado explícito de ausência |
| `GET /api/topics` | Temas |
| `GET /api/candidates`, `GET /api/candidates/[id]`, `GET /api/candidates/[id]/positions` | Candidatos e posições publicadas por pergunta |
| `GET /api/sources`, `GET /api/sources/[id]` | Registro de fontes (filtros `institution`, `legend`, `type`) |
| `GET /api/methodology`, `GET /api/methodology/history` | Metodologia vigente (1.2.0) e todas as versões, inclusive a 1.0.0 |
| `GET /api/research/protocols?questionId=` | Protocolos de pesquisa |
| `POST /api/survey/submissions` | Envio anônimo (schema estrito; rejeita qualquer campo identificável) |
| `POST /api/survey/feedback` | Avaliação anônima da pesquisa |
| `GET /api/admin/research[?format=csv]` | Agregados privados (token) |

O painel `/admin/posicoes` (Server Actions, token) publica, rejeita, despublica e publica em lote, com `AuditLog`. O modelo prevê `DRAFT → PENDING_REVIEW → APPROVED → PUBLISHED | REJECTED`; só `PUBLISHED` aparece ao público. Hoje a revisão é posição a posição, com o candidato visível; a revisão cega por evidência (`EvidenceReview`) está no modelo e ainda não tem tela.

### Processo de inclusão de fontes e evidências

1. Consultar o `ResearchProtocol` da questão (termos, fontes, período, critérios) **antes** de pesquisar.
2. Localizar na ordem: documento original → base pública → fonte primária do candidato → organismo técnico → imprensa profissional.
3. Registrar a fonte em `Source` (URL, instituição, tipo, datas, verificação do link, hash/arquivo quando possível).
4. Criar `Evidence` como `DRAFT` com trecho original, classificação, força e critério.
5. Revisão humana em `/admin/posicoes` (posição a posição; a revisão cega por evidência, `EvidenceReview`, está no modelo e ainda não tem tela).
6. Publicar (`PUBLISHED`) só depois da revisão. Cada mudança gera `AuditLog`.
7. `CandidatePosition` só pode ser publicada com ≥1 evidência aprovada e não apenas de nível D (`src/domain/publication.ts`).
8. Mudança de posição → cronologia, sem palavras como "mentira" ou "contradição".
9. Ingestão automática (`src/ingestion`) e classificação por LLM **nunca** publicam: produzem `DRAFT` com prompt, modelo, versão, resposta e confiança registrados.

### Regras de neutralidade verificadas em código

`tests/domain/neutrality-scan.test.ts` varre `src/` em busca de frases e identificadores de ranking/recomendação. `src/domain/publication.ts` rejeita resumos com linguagem proibida. `src/domain/comparison.ts` exporta uma única função, por questão. `src/domain/aggregates.ts` não possui função de intenção de voto. A ordem esquerda/direita dos candidatos é sorteada por sessão e os cards têm o mesmo espaço visual.

### Privacidade e logs

A aplicação não lê IP nem user agent. Se a infraestrutura de hospedagem (proxy, CDN, provedor) gerar logs de acesso com IP, eles ficam fora da aplicação; configure a menor retenção possível e documente-a aqui ao implantar.

### Estado atual e TODOs

- [x] Programas de 2026 obtidos pelos Dados Abertos do TSE (`proposta_governo_2026_BR.zip`); o portal do TSE segue bloqueando acesso automatizado, mas o CDN oficial de dados abertos responde.
- [x] 104 posições (52 perguntas × 2 candidatos) com evidências importadas e publicadas; painel `/admin/posicoes` com auditoria.
- [x] Deploy no Railway (ver `DEPLOY.md`): Postgres, migrações no start, seed e importação via SSH.
- [ ] **TODO(ingestão)** Implementar `SenadoAdapter` e `TseAdapter`; concluir `CamaraAdapter` (autores, tramitações, votos) e persistência de `RawDocument`.
- [ ] **TODO(revisão)** Tela de revisão cega por evidência (`EvidenceReview`) e endpoints POST de evidência.
- [ ] **TODO(conteúdo)** Três perguntas de Lula seguem sem posição documentada (drogas, barrar obras por impacto ambiental, religião na política); declarações sem link oficial (TV, entrevistas) não entram.
- [ ] Verificação manual pendente: endereços dos documentos no portal do TSE (bloqueia acesso automatizado; links apontam para a página oficial das Eleições 2026), Biblioteca da Presidência, OCDE, atuação de Flávio Bolsonaro na ALERJ (2003–2019) e candidatura de Lula ao Governo de SP em 1982.

### Deploy

Produção no Railway (serviço `voce-decide` + Postgres). Passo a passo, variáveis e comandos de seed/importação em `DEPLOY.md`.

### Como contribuir

- Toda alteração de pergunta, critério ou classificação exige nova entrada em `METHODOLOGY_VERSIONS` (nunca apague versões anteriores).
- Nenhum fato político entra no banco sem `Source` consultável. O conhecimento do modelo de linguagem não é fonte.
- Rode `npm test` antes de abrir PR: os testes de neutralidade e publicação são obrigatórios.
- Projeto anterior (quiz estático) preservado em `legacy-static/` apenas como referência histórica.
