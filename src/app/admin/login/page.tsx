import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";
import { adminToken } from "@/lib/env";
import { loginAction } from "./actions";

export const metadata: Metadata = { title: "Acesso administrativo", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  const configured = adminToken() !== null;
  return (
    <div className="container-page py-12 max-w-md">
      <PageTitle lead="Área privada do administrador do projeto. A sessão dura 10 minutos sem atividade e termina ao fechar o navegador; o token nunca fica salvo no navegador.">Acesso administrativo</PageTitle>
      {!configured ? (
        <p className="card p-4 text-sm">O painel está desativado: defina <code>ADMIN_TOKEN</code> (mínimo 16 caracteres) nas variáveis de ambiente.</p>
      ) : (
        <form action={loginAction} className="card p-5 space-y-4">
          <label className="block text-sm font-medium">Token de acesso
            <input name="token" type="password" autoComplete="off" required className="mt-1 w-full rounded-md border border-line px-3 py-2 min-h-11" />
          </label>
          {erro ? <p className="text-sm" role="alert">Token inválido.</p> : null}
          <button type="submit" className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-strong">Entrar</button>
        </form>
      )}
    </div>
  );
}
