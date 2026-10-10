import type { Metadata } from "next";
import { adminToken, adminTotpSecret } from "@/lib/env";
import { loginAction } from "./actions";
import { AdminTopBar } from "@/components/admin/AdminUI";
import { CodeInput } from "@/components/admin/CodeInput";

export const metadata: Metadata = { title: "Acesso administrativo", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ erro?: string; motivo?: string }> }) {
  const { erro, motivo } = await searchParams;
  const configured = adminToken() !== null;
  const totp = adminTotpSecret() !== null;
  return (
    <div className="min-h-screen bg-[#f3f2ef]">
    <AdminTopBar />
    <div className="grid min-h-[80vh] place-items-center px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-surface shadow-lg ring-1 ring-black/5">
        <div className="bg-gradient-to-r from-[#3b1f7a] via-purple to-[#2563eb] p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Área privada</p>
          <h1 className="mt-1 text-2xl font-bold">Acesso administrativo</h1>
          <p className="mt-1 text-sm text-white/85">{totp ? "Digite o código de 6 dígitos do Google Authenticator. A sessão dura 30 minutos; ao fechar ou atualizar a página, o código é pedido de novo." : "A sessão dura 30 minutos; ao fechar ou atualizar a página, o login é pedido de novo."}</p>
        </div>
        <div className="p-6">
          {!configured ? (
            <p className="text-sm">O painel está desativado: defina <code>ADMIN_TOKEN</code> (mínimo 16 caracteres) nas variáveis de ambiente.</p>
          ) : (
            <form action={loginAction} className="space-y-4">
              {motivo === "tempo" ? <p className="rounded-lg bg-gold-soft px-3 py-2 text-sm text-gold-strong">Sua sessão de 30 minutos terminou. Digite o código de novo.</p> : null}
              {motivo === "recarregou" ? <p className="rounded-lg bg-gold-soft px-3 py-2 text-sm text-gold-strong">Por segurança, ao atualizar ou reabrir a página o código é pedido de novo.</p> : null}
              {totp ? (
                <label className="block text-sm font-semibold text-ink">Código do Google Authenticator
                  <CodeInput />
                </label>
              ) : (
                <label className="block text-sm font-semibold text-ink">Token de acesso
                  <input name="token" type="password" autoComplete="off" required className="mt-1.5 w-full rounded-xl border border-line bg-paper/50 px-3 py-2.5 min-h-11 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30" />
                </label>
              )}
              {erro ? <p className="rounded-lg bg-[#fde8e8] px-3 py-2 text-sm text-[#9b1c1c]" role="alert">{erro === "bloqueado" ? "Muitas tentativas erradas. Espere 10 minutos." : totp ? "Código inválido ou já usado. Digite o código atual do aplicativo." : "Token inválido."}</p> : null}
              <button type="submit" className="admin-press w-full min-h-11 rounded-xl bg-gradient-to-r from-purple to-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95">Entrar</button>
            </form>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
