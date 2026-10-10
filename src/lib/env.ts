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

/** Segredo do Google Authenticator do admin (base32). Quando existe, o login pede o código de 6 dígitos. */
export function adminTotpSecret(): string | null {
  const t = process.env.ADMIN_TOTP_SECRET;
  return t && t.replace(/[^A-Za-z2-7]/g, "").length >= 16 ? t : null;
}
