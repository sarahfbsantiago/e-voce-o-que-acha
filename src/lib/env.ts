export type DataSourceMode = "static" | "prisma";

/** Decide a origem dos dados. Sem DATABASE_URL, roda em modo estático. */
export function dataSourceMode(): DataSourceMode {
  const forced = process.env.DATA_SOURCE;
  if (forced === "static" || forced === "prisma") return forced;
  return process.env.DATABASE_URL ? "prisma" : "static";
}

export function adminToken(): string | null {
  const t = process.env.ADMIN_TOKEN;
  return t && t.length >= 16 ? t : null;
}
