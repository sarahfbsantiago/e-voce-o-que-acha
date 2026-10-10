import { ADMIN_COOKIE } from "@/lib/admin-auth";

/** Sai do admin (tempo esgotado, página atualizada ou reaberta) e volta para o login pedindo o código. */
export async function GET(req: Request) {
  const motivo = new URL(req.url).searchParams.get("motivo") ?? "";
  // Endereço relativo: atrás do proxy do Railway, req.url aponta para o servidor interno (localhost:8080).
  const location = `/admin/login${motivo ? `?motivo=${encodeURIComponent(motivo)}` : ""}`;
  return new Response(null, {
    status: 303,
    headers: { Location: location, "Set-Cookie": `${ADMIN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}` },
  });
}
