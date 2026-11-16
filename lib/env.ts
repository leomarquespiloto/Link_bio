import { getCloudflareContext } from "@opennextjs/cloudflare";
export type Env={DB:D1Database;ADMIN_PASSWORD:string;SESSION_SECRET:string};
export async function getEnv(){const {env}=await getCloudflareContext({async:true});return env as unknown as Env;}
