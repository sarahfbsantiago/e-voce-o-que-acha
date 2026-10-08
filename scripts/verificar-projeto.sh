#!/usr/bin/env bash
# Verificação rápida do projeto Menos Pior: git, ganchos, cópias do iCloud, deploy, site no ar e banco local.
# Uso: bash scripts/verificar-projeto.sh
set -u
cd "$(dirname "$0")/.."
URL="${SITE_URL:-https://menos-pior.up.railway.app}"

echo "== Git"
if git fetch -q origin 2>/dev/null; then
  git rev-list --left-right --count origin/main...HEAD | awk '{print "  GitHub tem "$1" commit(s) que não estão aqui; aqui há "$2" ainda não enviado(s)"}'
fi
echo "  último commit: $(git log -1 --format='%h %ad %s' --date=format:'%d/%m %H:%M')"
echo "  autor: $(git log -1 --format='%an <%ae>')"
changes="$(git status --short)"
if [ -n "$changes" ]; then echo "  alterações não salvas:"; echo "$changes" | sed 's/^/    /'; else echo "  nada pendente de commit"; fi

echo "== Ganchos de commit"
for h in commit-msg pre-push; do
  if [ -x ".git/hooks/$h" ]; then echo "  $h: ok"; else echo "  $h: FALTANDO (reinstalar)"; fi
done

echo "== Cópias do iCloud (arquivos 'nome 2.ext')"
dups="$(find . -path ./node_modules -prune -o -path ./.git -prune -o -path ./.next -prune -o -name '* [0-9].*' -print)"
if [ -n "$dups" ]; then echo "$dups" | sed 's/^/  /'; else echo "  nenhuma"; fi

echo "== Railway (últimos deploys)"
railway deployment list --service voce-decide 2>/dev/null | sed -n 2,3p | sed 's/^ */  /' || echo "  não foi possível consultar"

echo "== Site no ar ($URL)"
for p in / /questionario /relatorio /fontes /metodologia /admin/login; do
  echo "  $p $(curl -s -o /dev/null -w '%{http_code}' "$URL$p")"
done

echo "== Banco local"
if n="$(psql -d voce_decide -Atc 'select count(*) from "Question"' 2>/dev/null)"; then echo "  ligado ($n perguntas)"; else echo "  desligado (abrir o Postgres.app)"; fi

echo "== Perguntas no código: $(npx tsx -e 'import { QUESTIONS } from "./src/data/questions"; console.log(QUESTIONS.length)' 2>/dev/null)"

echo "== Avisos"
if [ "$(date +%Y%m%d)" -lt 20261201 ]; then echo "  Railway: migrar railway.json antes de 01/12/2026 (railway config migrate)"; fi
