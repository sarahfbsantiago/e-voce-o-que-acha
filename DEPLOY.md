# Deploy no Railway

Site Next.js + PostgreSQL no mesmo projeto do Railway.

## 1. Repositório
O projeto está versionado em Git. Suba para o GitHub (repositório privado) e conecte ao Railway.

## 2. Projeto no Railway
1. New Project → Deploy from GitHub repo → escolha este repositório.
2. No mesmo projeto: + New → Database → PostgreSQL.
3. No serviço do site → Variables:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (referência ao banco do projeto)
   - `ADMIN_TOKEN` = um segredo longo, só seu (login em /admin)
   - `NODE_ENV` = `production`
4. O arquivo `railway.json` já define build (`npm run build`) e start (`prisma migrate deploy` + `npm start`).

## 3. Conteúdo inicial (uma vez, do seu computador, apontando para o banco de produção)
```bash
export DATABASE_URL="<URL pública do Postgres do Railway>"
npm run db:migrate            # cria as tabelas
npm run db:seed               # perguntas, temas, perfis, fontes, metodologia
npm run db:import-drafts      # resumos de programa, projetos e posições (rascunho)
```
Depois, publique as posições e os resumos em `/admin/posicoes` ("Publicar todos os rascunhos").
Alternativa: rode os mesmos comandos pelo shell do serviço no Railway.

## 4. Atualizações
- Conteúdo em arquivo (perguntas, perfis, fontes): editar em `src/data`, rodar `npm run db:seed` contra produção.
- Posições dos candidatos: `prisma/drafts/positions.draft.json`, depois `IMPORT_UPDATE_PUBLISHED=1 npm run db:import-drafts`.
- Código: `git push` guarda o histórico, mas o serviço ainda não está ligado ao GitHub; o deploy é feito pela CLI:
  `railway up --service voce-decide --detach` e depois `railway deployment list` até SUCCESS.
  Não use `railway redeploy` para publicar código novo: ele reconstrói o commit antigo.
- Depois do deploy, se `src/data` mudou: `ssh voce-decide-prod 'cd /app && npx tsx prisma/seed.ts'`.

## 5. Checagens antes de publicar
- `npm test`, `npx tsc --noEmit`, `npx eslint src`
- Abrir `/relatorio` depois de responder o questionário no site publicado.
- Conferir `/admin/research` com o token.
