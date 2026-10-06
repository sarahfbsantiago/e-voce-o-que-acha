"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, createSessionValue, isValidAdminToken, sessionCookieOptions } from "@/lib/admin-auth";

export async function loginAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  if (!isValidAdminToken(token)) redirect("/admin/login?erro=1");
  const value = createSessionValue();
  if (!value) redirect("/admin/login?erro=1");
  const store = await cookies();
  store.set(ADMIN_COOKIE, value, sessionCookieOptions());
  redirect("/admin/research");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/");
}
