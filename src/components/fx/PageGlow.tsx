"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const VARIANTS = ["glow-a", "glow-b", "glow-c"];

/**
 * Manchas de cor suaves atrás de todas as páginas. A composição muda por rota
 * e o conjunto desliza um pouco mais devagar que o conteúdo ao rolar (parallax).
 */
export function PageGlow() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  let hash = 0;
  for (const ch of pathname) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const variant = VARIANTS[hash % VARIANTS.length];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 640) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.transform = `translate3d(0, ${(-window.scrollY * 0.08).toFixed(1)}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 will-change-transform">
      <div className={`page-glow ${variant}`} />
    </div>
  );
}
