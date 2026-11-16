import { getEnv } from "@/lib/env";
import { defaultLinks, type SiteLink } from "@/lib/links";

type LinkRow = {
  slug: string;
  title: string;
  description: string;
  href: string;
  image: string;
  active: number;
  featured: number;
};

export async function getSiteLinks(): Promise<SiteLink[]> {
  try {
    const env = await getEnv();
    const result = await env.DB.prepare(
      "SELECT slug,title,description,href,image,active,featured FROM site_links ORDER BY position"
    ).all<LinkRow>();
    if (!result.results?.length) return defaultLinks;
    return result.results.map((row) => ({
      slug: row.slug,
      title: row.title,
      description: row.description,
      href: row.href,
      image: row.image,
      active: Boolean(row.active),
      featured: Boolean(row.featured)
    }));
  } catch {
    // Mantém a página pública disponível caso a migração ainda não tenha sido aplicada.
    return defaultLinks;
  }
}
