import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

/** Sai do admin (tempo esgotado, página atualizada ou reaberta) e volta para o login pedindo o código. */
export async function GET(req: Request) {
  const motivo = new URL(req.url).searchParams.get("motivo") ?? "";
  const res = NextResponse.redirect(new URL(`/admin/login${motivo ? `?motivo=${encodeURIComponent(motivo)}` : ""}`, req.url));
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
