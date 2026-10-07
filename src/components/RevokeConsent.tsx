"use client";

import { Button } from "@/components/ui";
import { useSession } from "@/store/session";

export function RevokeConsent() {
  const { session, hydrated, update, reset } = useSession();
  if (!hydrated) return null;
  return (
    <div className="card p-5 not-prose space-y-3 border-l-4 border-l-gold">
      <p className="text-sm">
        Consentimento atual:{" "}
        <strong>{session.consent === "accepted" ? "contribuindo anonimamente" : session.consent === "declined" ? "revogado (para responder de novo, é preciso aceitar)" : "ainda não informado"}</strong>
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => update({ consent: "declined", consentUpdatedAt: new Date().toISOString() })}>
          Revogar consentimento
        </Button>
        <Button variant="ghost" onClick={reset}>Apagar minhas respostas deste navegador</Button>
      </div>
    </div>
  );
}
