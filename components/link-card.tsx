"use client";
import type { SiteLink } from "@/lib/links";

export function LinkCard({ link }: { link: SiteLink }) {
  async function track() {
    try {
      await fetch("/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: link.slug })
      });
    } catch {
      // A navegação não depende do analytics.
    }
  }

  return (
    <a
      className="link-card"
      href={link.href}
      onClick={() => void track()}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={link.title}
    >
      <span
        className="cover"
        role="img"
        aria-label={link.title}
        style={{ backgroundImage: `url("${link.image}")` }}
      />
    </a>
  );
}
