# Leo Marques — Link Bio

Página de links do Leo Marques Racing com painel privado de analytics.

## Stack
- Next.js App Router + TypeScript
- Cloudflare Workers com OpenNext
- Cloudflare D1 para analytics
- GitHub Actions para build, migrações e deploy contínuo
- Painel administrativo protegido por senha do Worker

## Deploy automático pelo GitHub Actions

O workflow `.github/workflows/deploy-worker.yml` executa em cada push para `main` e também pode ser iniciado manualmente em **Actions → Deploy Cloudflare Worker → Run workflow**.

Configure estes **Repository secrets** em **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN`: token da Cloudflare com permissões para Workers Scripts, D1 e acesso à conta.
- `CLOUDFLARE_ACCOUNT_ID`: ID da conta Cloudflare.
- `CLOUDFLARE_D1_DATABASE_ID`: ID do banco D1 criado previamente.
- `ADMIN_PASSWORD`: senha de acesso ao painel `/admin`.
- `SESSION_SECRET`: segredo aleatório forte, com pelo menos 32 caracteres.

O workflow injeta o ID do D1 no arquivo de configuração durante o runner, aplica as migrações, atualiza os secrets do Worker e publica o Worker. O deploy cria/atualiza o Worker `painel`.

### Provisionamento inicial do D1

Crie o banco uma única vez na conta Cloudflare, por exemplo:

```bash
npx wrangler d1 create painel
```

Copie o `database_id` retornado para o secret `CLOUDFLARE_D1_DATABASE_ID`. Depois disso, os pushes para `main` cuidam das migrações e dos deploys.

## Desenvolvimento local

1. `npm install`
2. Copie `.dev.vars.example` para `.dev.vars` e configure `ADMIN_PASSWORD` e `SESSION_SECRET`.
3. Configure o `database_id` em `wrangler.jsonc` para trabalhar com D1 remoto, ou use o D1 local.
4. Aplique a migração local: `npx wrangler d1 migrations apply painel --local`.
5. Execute `npm run dev`.

## Rotas

- `/`: links públicos.
- `/admin`: painel de cliques protegido por senha.
- `/api/click`: registra cliques.
- `/api/admin`: login (POST), métricas (GET), logout (DELETE).

Edite `lib/links.ts` para configurar destinos e imagens. Destinos estão como `#` e imagens devem ser adicionadas em `public/images/`. Analytics registra slug e data/hora; não armazena IP.
