import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { makeToken, setSession, clearSession, isAdmin } from "@/lib/session";
import { defaultLinks, type SiteLink } from "@/lib/links";
import { getSiteLinks } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { password?: string } | null;
  const env = await getEnv();
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET || body?.password !== env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Senha inválida." }, { status: 401 });
  }
  await setSession(makeToken(env.SESSION_SECRET));
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const env = await getEnv();
  if (!(await isAdmin(env.SESSION_SECRET))) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const [all, today, grouped, recent, siteLinks] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) total FROM link_clicks").first<{ total: number }>(),
    env.DB.prepare("SELECT COUNT(*) total FROM link_clicks WHERE date(created_at)=date('now')").first<{ total: number }>(),
    env.DB.prepare("SELECT link_slug,COUNT(*) total FROM link_clicks GROUP BY link_slug ORDER BY total DESC").all<{ link_slug: string; total: number }>(),
    env.DB.prepare("SELECT link_slug,created_at FROM link_clicks ORDER BY id DESC LIMIT 20").all<{ link_slug: string; created_at: string }>(),
    getSiteLinks()
  ]);

  return NextResponse.json({
    total: all?.total ?? 0,
    today: today?.total ?? 0,
    byLink: siteLinks.map((link) => ({
      slug: link.slug,
      title: link.title,
      total: grouped.results.find((item) => item.link_slug === link.slug)?.total ?? 0
    })),
    recent: recent.results,
    links: siteLinks
  });
}

export async function PUT(request: Request) {
  const env = await getEnv();
  if (!(await isAdmin(env.SESSION_SECRET))) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { links?: SiteLink[] } | null;
  if (!Array.isArray(body?.links) || body.links.length !== defaultLinks.length) {
    return NextResponse.json({ error: "Lista de banners inválida." }, { status: 400 });
  }

  const allowed = new Set(defaultLinks.map((item) => item.slug));
  for (const item of body.links) {
    if (
      !item || !allowed.has(item.slug) ||
      typeof item.title !== "string" || !item.title.trim() || item.title.length > 80 ||
      typeof item.description !== "string" || item.description.length > 160 ||
      typeof item.href !== "string" || item.href.length > 2048 ||
      !/^(https?:\/\/|mailto:|tel:|#)/i.test(item.href) ||
      typeof item.image !== "string" || item.image.length > 650000 ||
      !(/^(https?:\/\/|\/|data:image\/webp;base64,)/i.test(item.image)) ||
      typeof item.active !== "boolean" || typeof item.featured !== "boolean"
    ) {
      return NextResponse.json({ error: "Revise os campos e os formatos dos banners." }, { status: 400 });
    }
  }

  for (const item of body.links) {
    const position = defaultLinks.findIndex((entry) => entry.slug === item.slug);
    await env.DB.prepare(
      `INSERT INTO site_links (slug,title,description,href,image,active,featured,position)
       VALUES (?,?,?,?,?,?,?,?)
       ON CONFLICT(slug) DO UPDATE SET
       title=excluded.title, description=excluded.description, href=excluded.href,
       image=excluded.image, active=excluded.active, featured=excluded.featured,
       position=excluded.position`
    ).bind(
      item.slug, item.title.trim(), item.description.trim(), item.href.trim(),
      item.image, item.active ? 1 : 0, item.featured ? 1 : 0, position
    ).run();
  }

  return NextResponse.json({ ok: true });
}
