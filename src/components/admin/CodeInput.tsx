"use client";

import { useState } from "react";

/** Campo do código do Google Authenticator: só números, no máximo 6, e envia sozinho ao completar. */
export function CodeInput() {
  const [value, setValue] = useState("");
  return (
    <input name="code" value={value}
      onChange={(e) => {
        const v = e.target.value.replace(/\D/g, "").slice(0, 6);
        setValue(v);
        // 6 dígitos: entra sozinho (sem clicar em Entrar); se o código estiver errado, a página volta com o aviso
        if (v.length === 6) e.target.form?.requestSubmit();
      }}
      inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} autoComplete="one-time-code" autoFocus required placeholder="000000"
      className="mt-1.5 w-full rounded-xl border border-line bg-paper/50 px-3 py-3 text-center text-2xl font-bold tracking-[0.4em] min-h-11 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30" />
  );
}
