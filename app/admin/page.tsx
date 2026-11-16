"use client";
import {useEffect,useState} from "react";
type Stats={total:number;today:number;byLink:{slug:string;title:string;total:number}[];recent:{link_slug:string;created_at:string}[]};
export default function Admin(){
 const [password,setPassword]=useState(""); const [stats,setStats]=useState<Stats|null>(null); const [error,setError]=useState("");
 async function refresh(){const r=await fetch("/api/admin",{cache:"no-store"});if(r.ok)setStats(await r.json());else setStats(null);}
 useEffect(()=>{void refresh();},[]);
 async function login(e:React.FormEvent){e.preventDefault();setError("");const r=await fetch("/api/admin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});if(!r.ok){setError("Senha incorreta.");return;}setPassword("");await refresh();}
 async function logout(){await fetch("/api/admin",{method:"DELETE"});setStats(null);}
 return <main className="admin"><div className="admin-shell"><p className="eyebrow">LEO MARQUES RACING · 95</p><h1 className="admin-title">Painel de acessos</h1>
 {!stats?<form className="panel" onSubmit={login}><p className="muted">Área restrita. Informe sua senha.</p><input className="field" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha de acesso" autoComplete="current-password" required/>{error&&<p className="muted">{error}</p>}<button className="btn">Entrar</button></form>:
 <section className="panel"><button className="btn" onClick={logout}>Sair</button><div className="metrics"><div className="metric"><strong>{stats.total}</strong><small>Cliques totais</small></div><div className="metric"><strong>{stats.today}</strong><small>Cliques hoje (UTC)</small></div></div>
 <h2 className="admin-title">Cliques por link</h2><table className="table"><thead><tr><th>Link</th><th>Cliques</th></tr></thead><tbody>{stats.byLink.map(x=><tr key={x.slug}><td>{x.title}</td><td>{x.total}</td></tr>)}</tbody></table>
 <h2 className="admin-title">Últimos cliques</h2><table className="table"><thead><tr><th>Link</th><th>Data (UTC)</th></tr></thead><tbody>{stats.recent.map((x,i)=><tr key={i}><td>{x.link_slug}</td><td>{x.created_at}</td></tr>)}</tbody></table><button className="btn" style={{marginTop:16}} onClick={()=>void refresh()}>Atualizar</button></section>}
 </div></main>;
}