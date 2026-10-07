"use client";

import { useId, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui";

/**
 * Pop-up acessível com <dialog> nativo: abre por um botão, fecha no X, no Esc e ao clicar fora.
 * No celular sobe como uma folha a partir da base; no desktop fica centralizado.
 */
export function Modal({ trigger, title, children, variant = "secondary", className = "", plainTrigger = false }: {
  trigger: ReactNode;
  /** Usa um botão sem o estilo padrão (ex.: um quadrado/cartão), com o className informado. */
  plainTrigger?: boolean;
  title: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const open = () => ref.current?.showModal();
  const close = () => ref.current?.close();

  return (
    <>
      {plainTrigger ? (
        <button type="button" className={`print:hidden ${className}`} onClick={open}>{trigger}</button>
      ) : (
        <Button type="button" variant={variant} className={`print:hidden ${className}`} onClick={open}>{trigger}</Button>
      )}
      <dialog
        ref={ref}
        className="modal"
        aria-labelledby={titleId}
        onClick={(e) => { if (e.target === ref.current) close(); }}
      >
        <div className="modal-panel">
          <header className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-surface/95 px-5 py-4 backdrop-blur">
            <h3 id={titleId} className="text-lg font-bold leading-snug">{title}</h3>
            <button type="button" onClick={close} aria-label="Fechar" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:bg-paper hover:text-ink">
              <span aria-hidden="true" className="text-xl leading-none">×</span>
            </button>
          </header>
          <div className="modal-body px-5 py-4">{children}</div>
        </div>
      </dialog>
    </>
  );
}
