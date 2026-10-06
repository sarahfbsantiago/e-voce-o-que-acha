"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = [
  "main .card:not([class*=\"animate-fade-up\"])",
  "main .prose-vd > h2",
  "main .prose-vd > h3",
  "main .prose-vd > p",
  "main .prose-vd > ul",
  "main .prose-vd > ol",
  "main figure",
].join(", ");

/**
 * Faz blocos aparecerem conforme entram na tela (fade + deslize), em cascata.
 * Só esconde algo depois que o JS está ativo (classe reveal-ready no <html>),
 * então sem JS ou com movimento reduzido tudo fica visível.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.querySelector("main");
    if (!main) return;
    document.documentElement.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        let i = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.setProperty("--reveal-delay", `${Math.min(i * 70, 420)}ms`);
          el.classList.add("is-visible");
          io.unobserve(el);
          i += 1;
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const scan = () => {
      main.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (el.dataset.reveal !== undefined) return;
        el.dataset.reveal = "";
        io.observe(el);
      });
    };
    scan();
    let timer: ReturnType<typeof setTimeout> | null = null;
    const mo = new MutationObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(scan, 80);
    });
    mo.observe(main, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      if (timer) clearTimeout(timer);
      document.documentElement.classList.remove("reveal-ready");
    };
  }, [pathname]);

  return null;
}
