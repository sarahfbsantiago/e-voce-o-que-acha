import { redirect } from "next/navigation";

/** /admin leva ao painel; sem sessão, a página de destino manda para o login. */
export default function AdminIndex() {
  redirect("/admin/research");
}
