"use client";

import { useEffect, useState } from "react";
import type { SiteLink } from "@/lib/links";

type Stats = {
  total: number;
  today: number;
  byLink: { slug: string; title: string; total: number }[];
  recent: { link_slug: string; created_at: string }[];
};
type AdminData = Stats & { links: SiteLink[] };

async function prepareBanner(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Selecione um arquivo de imagem.");
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 500;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Não foi possível processar a imagem.");
  context.clearRect(0, 0, canvas.width, canvas.height);
  const scale = Math.min(1600 / bitmap.width, 500 / bitmap.height);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  context.drawImage(bitmap, Math.round((1600 - width) / 2), Math.round((500 - height) / 2), width, height);
  bitmap.close();

  for (const quality of [0.88, 0.82, 0.76, 0.7, 0.64]) {
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Falha ao preparar a imagem.")), "image/webp", quality);
    });
    if (blob.size <= 420 * 1024) {
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
        reader.readAsDataURL(blob);
      });
    }
  }
  throw new Error("A imagem ficou muito grande. Escolha uma arte mais leve.");
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [draftLinks, setDraftLinks] = useState<SiteLink[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const response = await fetch("/api/admin", { cache: "no-store" });
    if (!response.ok) {
      setStats(null);
      return;
    }
    const data = await response.json() as AdminData;
    setStats({ total: data.total, today: data.today, byLink: data.byLink, recent: data.recent });
    setDraftLinks(data.links);
  }

  useEffect(() => { void refresh(); }, []);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (!response.ok) {
      setError("Senha incorreta.");
      return;
    }
    setPassword("");
    await refresh();
  }

  async function logout() {
    await fetch("/api/admin", { method: "DELETE" });
    setStats(null);
    setDraftLinks([]);
  }

  function updateLink(slug: string, changes: Partial<SiteLink>) {
    setDraftLinks((current) => current.map((item) => item.slug === slug ? { ...item, ...changes } : item));
  }

  async function uploadImage(slug: string, file?: File) {
    if (!file) return;
    setError("");
    setNotice("");
    try {
      const image = await prepareBanner(file);
      updateLink(slug, { image });
      setNotice("Imagem preparada. Clique em Salvar alterações para publicar.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível carregar a imagem.");
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: draftLinks })
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Não foi possível salvar as alterações.");
      }
      await refresh();
      setNotice("Alterações salvas e publicadas na página.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin">
      <div className="admin-shell">
        <p className="eyebrow">LEO MARQUES RACING · 99</p>
        <h1 className="admin-title">Painel administrativo</h1>
        {!stats ? (
          <form className="panel login-panel" onSubmit={login}>
            <p className="muted">Área restrita. Informe sua senha.</p>
            <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Senha de acesso" autoComplete="current-password" required />
            {error && <p className="admin-error">{error}</p>}
            <button className="btn" type="submit">Entrar</button>
          </form>
        ) : (
          <>
            <form className="panel content-panel" onSubmit={save}>
              <div className="admin-heading-row">
                <div>
                  <h2 className="admin-title">Conteúdo da página</h2>
                  <p className="muted">Edite os quatro banners. As alterações só entram no ar depois de salvar.</p>
                </div>
                <button className="btn btn-secondary" type="button" onClick={logout}>Sair</button>
              </div>

              {draftLinks.map((link, index) => (
                <section className="editor-card" key={link.slug}>
                  <div className="editor-title-row">
                    <h3>{String(index + 1).padStart(2, "0")} · {link.slug === "online" ? "MÉTODO DAC" : link.title}</h3>
                    <label className="switch-label">
                      <input type="checkbox" checked={link.active} onChange={(event) => updateLink(link.slug, { active: event.target.checked })} />
                      <span>Publicado</span>
                    </label>
                  </div>

                  <div className="banner-preview">
                    <img src={link.image} alt={`Prévia do banner ${link.title}`} />
                  </div>

                  <div className="editor-grid">
                    <label className="admin-label">Título
                      <input className="field" maxLength={80} value={link.title} onChange={(event) => updateLink(link.slug, { title: event.target.value })} required />
                    </label>
                    <label className="admin-label">Descrição
                      <input className="field" maxLength={160} value={link.description} onChange={(event) => updateLink(link.slug, { description: event.target.value })} />
                    </label>
                    <label className="admin-label editor-full">Link de destino
                      <input className="field" type="url" value={link.href.startsWith("#") ? "" : link.href} placeholder="https://..." onChange={(event) => updateLink(link.slug, { href: event.target.value || "#" })} />
                    </label>
                  </div>

                  <div className="image-controls">
                    <label className="upload-control">
                      <span className="btn">Enviar nova imagem</span>
                      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void uploadImage(link.slug, event.target.files?.[0])} />
                    </label>
                    <label className="switch-label featured-toggle">
                      <input type="checkbox" checked={link.featured} onChange={(event) => updateLink(link.slug, { featured: event.target.checked })} />
                      <span>Destacar banner</span>
                    </label>
                    <small className="muted">PNG, JPG ou WebP · ajustado para 1600 × 500 · até 420 KB.</small>
                  </div>
                </section>
              ))}

              {error && <p className="admin-error">{error}</p>}
              {notice && <p className="admin-notice">{notice}</p>}
              <div className="save-row">
                <button className="btn" type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar alterações"}</button>
                <button className="btn btn-secondary" type="button" onClick={() => void refresh()}>Descartar alterações</button>
              </div>
            </form>

            <section className="panel stats-panel">
              <h2 className="admin-title">Estatísticas de acessos</h2>
              <div className="metrics">
                <div className="metric"><strong>{stats.total}</strong><small>Cliques totais</small></div>
                <div className="metric"><strong>{stats.today}</strong><small>Cliques hoje (UTC)</small></div>
              </div>
              <h3 className="stats-heading">Cliques por link</h3>
              <table className="table">
                <thead><tr><th>Link</th><th>Cliques</th></tr></thead>
                <tbody>{stats.byLink.map((item) => <tr key={item.slug}><td>{item.title}</td><td>{item.total}</td></tr>)}</tbody>
              </table>
              <h3 className="stats-heading">Últimos cliques</h3>
              <table className="table">
                <thead><tr><th>Link</th><th>Data (UTC)</th></tr></thead>
                <tbody>{stats.recent.map((item, index) => <tr key={index}><td>{item.link_slug}</td><td>{item.created_at}</td></tr>)}</tbody>
              </table>
              <button className="btn btn-secondary refresh-btn" type="button" onClick={() => void refresh()}>Atualizar estatísticas</button>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
