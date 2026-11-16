"use client";
import type {links} from "@/lib/links";
type Item=(typeof links)[number];
export function LinkCard({link}:{link:Item}){async function track(){try{await fetch("/api/click",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:link.slug})});}catch{/* navigation must not depend on analytics */}}
return <a className={`link-card ${"featured" in link&&link.featured?"featured":""}`} href={link.href} onClick={()=>void track()}><span className="cover" style={{backgroundImage:`linear-gradient(90deg,rgba(0,0,0,.92),rgba(0,0,0,.2)),url(${link.image})`}}/><span className="copy"><strong>{link.title}</strong><small>{link.description}</small></span><b className="arrow">↗</b></a>;}
