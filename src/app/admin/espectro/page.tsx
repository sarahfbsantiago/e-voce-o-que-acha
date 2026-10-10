import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminUI";
import { EspectroSection } from "@/components/admin/sections/EspectroSection";

export const metadata: Metadata = { title: "Espectro político", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isAdminSession())) redirect("/admin/login");
  return <AdminShell current="/admin/espectro"><EspectroSection /></AdminShell>;
}
