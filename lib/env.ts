import { getCloudflareContext } from "@opennextjs/cloudflare";

type D1Statement = {
  bind(...values: (string | number | boolean | null)[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[]; success: boolean }>;
  run(): Promise<{ success: boolean }>;
};

type D1Database = {
  prepare(query: string): D1Statement;
};

export type Env = {
  DB: D1Database;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
};

export async function getEnv() {
  const { env } = await getCloudflareContext({ async: true });
  return env as unknown as Env;
}
