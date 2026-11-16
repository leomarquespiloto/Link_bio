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
      className={`link-card ${link.featured ? "featured" : ""}`}
      href={link.href}
      onClick={() => void track()}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      <span
        className="cover"
        style={{ backgroundImage: `linear-gradient(90deg,rgba(0,0,0,.92),rgba(0,0,0,.2)),url("${link.image}")` }}
      />
      <span className="copy">
        <strong>{link.title}</strong>
        <small>{link.description}</small>
      </span>
      <b className="arrow">↗</b>
    </a>
  );
}
