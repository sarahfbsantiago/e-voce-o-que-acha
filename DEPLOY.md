# Deploy no Railway

Site Next.js + PostgreSQL no mesmo projeto do Railway (serviço `site-questionario` + `Postgres`).

## 1. Projeto no Railway
1. New Project → Deploy from GitHub repo → escolha o repositório de deploy.
2. No mesmo projeto: + New → Database → PostgreSQL.
3. No serviço do site → Variables:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (rede interna do projeto)
   - `ADMIN_TOKEN` = segredo longo que assina a sessão do painel
   - `ADMIN_TOTP_SECRET` = chave do aplicativo autenticador (login com código de 6 dígitos)
   - `NODE_ENV` = `production`
4. `railway.json` define o build e o start (`prisma migrate deploy` + `npm start`): as migrações rodam sozinhas a cada deploy.

## 2. Conteúdo inicial (uma vez)
Pelo shell do serviço (`railway ssh`) ou do seu computador apontando para o banco de produção:
```bash
npm run db:seed               # perguntas, temas, perfis, fontes, metodologia
npm run db:import-drafts      # resumos de programa, projetos e posições (rascunho)
```
Depois, publique as posições pelo painel privado (Revisão de posições).

## 3. Atualizações
- **Código:** `git push origin main`. O Railway está ligado ao repositório e faz o deploy sozinho; acompanhe com `railway deployment list --service site-questionario` até SUCCESS.
- **Perguntas, notas, faixas, régua, textos, fontes e posições:** pelo painel privado (rascunho → aprovação → publicação, com histórico). Os arquivos em `src/data` são só o estado inicial; mudá-los não altera o site em produção.
- **Metodologia e conteúdo-base em `src/data`:** depois do deploy, rode o seed no servidor: `npx tsx prisma/seed.ts`.

## 4. Checagens antes de publicar
- `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`
- Responder o questionário no site publicado e abrir `/relatorio`.
