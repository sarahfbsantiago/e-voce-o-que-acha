import { NextResponse } from "next/server";

export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { headers: { "cache-control": "no-store" }, ...init });
}

export function notFound(message = "Não encontrado.") {
  return json({ error: message }, { status: 404 });
}

export function badRequest(message: string, details?: unknown) {
  return json({ error: message, details }, { status: 400 });
}
