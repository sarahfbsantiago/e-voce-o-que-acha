"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Mostra o conteúdo só no site público; no painel admin (/admin) ele some, para não misturar os dois ambientes. */
export function SiteOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname?.startsWith("/admin") ? null : <>{children}</>;
}
