# Leo Marques — Link Bio

Página de links do Leo Marques Racing com painel privado de conteúdo e analytics.

## Stack
- Next.js App Router + TypeScript
- Cloudflare Workers com OpenNext
- Cloudflare D1 para conteúdo e analytics
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

O workflow injeta o ID do D1, aplica as migrações, atualiza os secrets do Worker e publica o Worker `leo-marques-link-bio`.

### Provisionamento inicial do D1

Crie o banco uma única vez na conta Cloudflare, por exemplo:
```bash
npx wrangler d1 create painel
```
Copie o `database_id` retornado para o secret `CLOUDFLARE_D1_DATABASE_ID`.

## Painel administrativo

- `/admin`: login, edição dos quatro banners e estatísticas.
- É possível alterar título, descrição, destino, imagem, destaque e publicação de cada banner.
- As imagens enviadas são convertidas no navegador para WebP, mantendo transparência, ajustadas em uma tela de 1600 × 500 e limitadas a 420 KB.
- O conteúdo fica salvo no D1 e é lido pela página pública; não é necessário editar arquivos nem fazer novo deploy para mudar banners.
- Os slugs dos banners são fixos para preservar o histórico de analytics.

## Desenvolvimento local

1. `npm install`
2. Copie `.dev.vars.example` para `.dev.vars` e configure `ADMIN_PASSWORD` e `SESSION_SECRET`.
3. Configure o `database_id` em `wrangler.jsonc`.
4. Aplique as migrações: `npx wrangler d1 migrations apply painel --local`.
5. Execute `npm run dev`.

## Rotas

- `/`: página pública.
- `/admin`: painel de conteúdo e analytics.
- `/api/click`: registra cliques.
- `/api/admin`: login (POST), métricas/conteúdo (GET), salvar conteúdo (PUT), logout (DELETE).

## Padrão das artes

As artes dos quatro banners devem priorizar o padrão **1600 × 500 px**, PNG com transparência real (canal alfa), mantendo textos e elementos importantes dentro da área segura. O painel preserva a proporção da arte e centraliza imagens que não tenham essa proporção.
