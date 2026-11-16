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
        <footer>LEO MARQUES RACING <b>·</b> 99</footer>
      </div>
    </main>
  );
}
