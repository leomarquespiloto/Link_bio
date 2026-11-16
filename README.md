# Leo Marques — Link Bio

Página de links do Leo Marques Racing com painel privado de analytics.

## Stack
- Next.js App Router + TypeScript
- Cloudflare Workers com OpenNext
- Cloudflare D1 para analytics
- Painel administrativo protegido por senha secreta do Worker

## Preparar localmente
1. npm install
2. Copie .dev.vars.example para .dev.vars e configure ADMIN_PASSWORD e SESSION_SECRET (mínimo 32 caracteres).
3. Crie o banco D1 leo-marques-link-bio e substitua database_id em wrangler.jsonc.
4. Aplique a migração local: npx wrangler d1 migrations apply leo-marques-link-bio --local.
5. Execute npm run dev.

## Cloudflare
1. Crie o D1 e configure o database_id.
2. Configure os secrets no Worker: npx wrangler secret put ADMIN_PASSWORD e npx wrangler secret put SESSION_SECRET.
3. Aplique a migração remota: npx wrangler d1 migrations apply leo-marques-link-bio --remote.
4. Execute npm run deploy.

## Rotas
- /: links públicos.
- /admin: painel de cliques protegido por senha.
- /api/click: registra cliques.
- /api/admin: login (POST), métricas (GET), logout (DELETE).

Edite lib/links.ts para configurar destinos e imagens. Destinos estão como # e imagens devem ser adicionadas em public/images/. Analytics registra slug e data/hora; não armazena IP.
