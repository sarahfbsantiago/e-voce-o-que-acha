"use client";

import dynamic from "next/dynamic";

/** Carrega a prévia só no navegador (ela aplica a configuração do pedido localmente). */
export const SitePreviewLoader = dynamic(() => import("./SitePreview").then((m) => m.SitePreview), { ssr: false, loading: () => <p className="p-6 text-sm text-ink-3">Montando a prévia…</p> });
