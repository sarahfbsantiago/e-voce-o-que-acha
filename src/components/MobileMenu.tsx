"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Item = { href: string; label: string };

/**
 * Menu do celular. Fecha ao clicar/tocar fora, ao apertar Esc e ao escolher um link.
 */
export function MobileMenu({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const close = () => { el.open = false; };
    const onPointerDown = (e: PointerEvent) => {
      if (el.open && !el.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <details ref={ref} className="md:hidden relative">
      <summary className="rounded-md border border-line px-3 py-1.5 text-sm" aria-label="Abrir menu">
        Menu
      </summary>
      <nav aria-label="Principal" className="absolute right-0 mt-2 w-56 card p-2 shadow-lg flex flex-col text-sm">
        {items.map((n) => (
          <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 hover:bg-purple-soft hover:text-purple-strong" onClick={() => { if (ref.current) ref.current.open = false; }}>
            {n.label}
          </Link>
        ))}
      </nav>
    </details>
  );
}
