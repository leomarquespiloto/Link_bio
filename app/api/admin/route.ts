import {NextResponse} from "next/server";
import {getEnv} from "@/lib/env";
import {makeToken,setSession,clearSession,isAdmin} from "@/lib/session";
import {links} from "@/lib/links";
export async function POST(request:Request){
 const body=await request.json().catch(()=>null) as {password?:string}|null;
 const env=await getEnv();
 if(!env.ADMIN_PASSWORD||!env.SESSION_SECRET||body?.password!==env.ADMIN_PASSWORD) return NextResponse.json({error:"Senha inválida."},{status:401});
 await setSession(makeToken(env.SESSION_SECRET));
 return NextResponse.json({ok:true});
}
export async function DELETE(){await clearSession();return NextResponse.json({ok:true});}
export async function GET(){
 const env=await getEnv();
 if(!(await isAdmin(env.SESSION_SECRET))) return NextResponse.json({error:"Não autorizado."},{status:401});
 const [all,today,grouped,recent]=await Promise.all([
  env.DB.prepare("SELECT COUNT(*) total FROM link_clicks").first<{total:number}>(),
  env.DB.prepare("SELECT COUNT(*) total FROM link_clicks WHERE date(created_at)=date('now')").first<{total:number}>(),
  env.DB.prepare("SELECT link_slug,COUNT(*) total FROM link_clicks GROUP BY link_slug ORDER BY total DESC").all<{link_slug:string;total:number}>(),
  env.DB.prepare("SELECT link_slug,created_at FROM link_clicks ORDER BY id DESC LIMIT 20").all<{link_slug:string;created_at:string}>()
 ]);
 return NextResponse.json({total:all?.total??0,today:today?.total??0,byLink:links.map(x=>({slug:x.slug,title:x.title,total:grouped.results.find((y: {link_slug:string; total:number})=>y.link_slug===x.slug)?.total??0})),recent:recent.results});
}