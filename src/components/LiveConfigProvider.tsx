"use client";

import type { ReactNode } from "react";
import { applyConfig, type LiveConfig } from "@/lib/live-config";

/**
 * Aplica no navegador a mesma configuração publicada que o servidor usou (perguntas, notas, faixas e régua),
 * antes de qualquer componente abaixo ler os dados. Assim a conta do relatório é idêntica à do servidor.
 */
export function LiveConfigProvider({ cfg, cfgKey, children }: { cfg: LiveConfig; cfgKey: string; children: ReactNode }) {
  applyConfig(cfg, cfgKey);
  return <>{children}</>;
}
