import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
const COOKIE="leo_admin";
const sign=(value:string,secret:string)=>createHmac("sha256",secret).update(value).digest("hex");
export function makeToken(secret:string){const exp=String(Math.floor(Date.now()/1000)+60*60*24*7);return exp+"."+sign(exp,secret);}
export function validToken(token:string|undefined,secret:string){if(!token)return false;const [exp,sig]=token.split(".");if(!exp||!sig||!/^\d+$/.test(exp)||Number(exp)<Date.now()/1000)return false;const a=Buffer.from(sig),b=Buffer.from(sign(exp,secret));return a.length===b.length&&timingSafeEqual(a,b);}
export async function setSession(token:string){(await cookies()).set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:60*60*24*7});}
export async function clearSession(){(await cookies()).delete(COOKIE);}
export async function isAdmin(secret:string){return validToken((await cookies()).get(COOKIE)?.value,secret);}
