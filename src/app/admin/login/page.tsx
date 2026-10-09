import type { Metadata } from "next";
import { adminToken } from "@/lib/env";
import { loginAction } from "./actions";

export const metadata: Metadata = { title: "Acesso administrativo", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  const configured = adminToken() !== null;
  return (
    <div className="grid min-h-[80vh] place-items-center bg-[#f3f2ef] px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-surface shadow-lg ring-1 ring-black/5">
        <div className="bg-gradient-to-r from-[#3b1f7a] via-purple to-[#2563eb] p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Área privada</p>
          <h1 className="mt-1 text-2xl font-bold">Acesso administrativo</h1>
          <p className="mt-1 text-sm text-white/85">A sessão dura 10 minutos sem atividade e termina ao fechar o navegador. O token nunca fica salvo.</p>
        </div>
        <div className="p-6">
          {!configured ? (
            <p className="text-sm">O painel está desativado: defina <code>ADMIN_TOKEN</code> (mínimo 16 caracteres) nas variáveis de ambiente.</p>
          ) : (
            <form action={loginAction} className="space-y-4">
              <label className="block text-sm font-semibold text-ink">Token de acesso
                <input name="token" type="password" autoComplete="off" required className="mt-1.5 w-full rounded-xl border border-line bg-paper/50 px-3 py-2.5 min-h-11 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30" />
              </label>
              {erro ? <p className="rounded-lg bg-[#fde8e8] px-3 py-2 text-sm text-[#9b1c1c]" role="alert">Token inválido.</p> : null}
              <button type="submit" className="w-full min-h-11 rounded-xl bg-gradient-to-r from-purple to-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95">Entrar</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
