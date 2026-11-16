import {NextResponse} from "next/server";
import {getEnv} from "@/lib/env";
import {links} from "@/lib/links";
export async function POST(request:Request){
 const body=await request.json().catch(()=>null) as {slug?:string}|null;
 const slug=body?.slug;
 if(!slug||!links.some(x=>x.slug===slug)) return NextResponse.json({ok:false},{status:400});
 const env=await getEnv();
 await env.DB.prepare("INSERT INTO link_clicks(link_slug) VALUES(?)").bind(slug).run();
 return NextResponse.json({ok:true});
}