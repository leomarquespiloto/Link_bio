import { LinkCard } from "@/components/link-card";
import { getSiteLinks } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const links = (await getSiteLinks()).filter((link) => link.active);

  return (
    <main className="page">
      <div className="shell">
        <header className="profile">
          <img className="brand-logo" src="https://raw.githubusercontent.com/leomarquespiloto/Link_bio/main/Leo-Marques-Racing_04.png" alt="Leo Marques 99 Racing" />
          <p className="eyebrow">PILOTO · INSTRUTOR · PERFORMANCE</p>
          <h1>DOMINE SUA MÁQUINA.<br /><em>EVOLUA SUA PILOTAGEM.</em></h1>
          <p className="intro">Experiências, conhecimento e produtos oficiais Leo Marques Racing.</p>
        </header>
        <section className="links">
          {links.map((link) => <LinkCard key={link.slug} link={link} />)}
        </section>

        <section className="social-section" aria-labelledby="social-title">
          <h2 id="social-title">MÍDIAS SOCIAIS <em>OFICIAIS</em></h2>
          <div className="social-links">
            <a className="social-link" href="https://www.instagram.com/leo_mar_ques/" target="_blank" rel="noopener noreferrer" aria-label="Instagram oficial de Leo Marques: @leo_mar_ques">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle className="social-icon-dot" cx="17.5" cy="6.5" r="1" />
              </svg>
              <span><strong>Instagram</strong><small>@leo_mar_ques</small></span>
              <b className="social-arrow">↗</b>
            </a>
            <a className="social-link" href="https://www.tiktok.com/@leo_mar_ques" target="_blank" rel="noopener noreferrer" aria-label="TikTok oficial de Leo Marques: leo_mar_ques">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.6 8.2a7.1 7.1 0 0 1-4.4-1.5v8.1a6.1 6.1 0 1 1-5.3-6.05v3.25a2.9 2.9 0 1 0 2.05 2.8V2.5h3.25c.22 2.1 1.7 3.8 4.4 4.15v1.55Z" />
              </svg>
              <span><strong>TikTok</strong><small>leo_mar_ques</small></span>
              <b className="social-arrow">↗</b>
            </a>
          </div>
        </section>
        <footer>LEO MARQUES RACING <b>·</b> 99</footer>
      </div>
    </main>
  );
}
