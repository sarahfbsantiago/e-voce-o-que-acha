"use client";

import { useState, useSyncExternalStore } from "react";

const NAME_KEY = "vd-admin-nome";
const read = () => { try { return localStorage.getItem(NAME_KEY) ?? ""; } catch { return ""; } };

/** Nome de quem publica, lembrado no navegador; enquanto não for digitado, vale o último usado. */
export function useAdminName(): [string, (v: string) => void, () => void] {
  const stored = useSyncExternalStore(() => () => {}, read, () => "");
  const [typed, setTyped] = useState<string | null>(null);
  const name = typed ?? stored;
  const remember = () => { try { localStorage.setItem(NAME_KEY, name.trim()); } catch {} };
  return [name, setTyped, remember];
}
