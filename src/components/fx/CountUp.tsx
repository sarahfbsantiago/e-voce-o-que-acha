"use client";

import { useEffect, useRef, useState } from "react";

/** Número que conta de zero até o valor ao entrar na tela. Aceita sufixo (ex.: "100%"). */
export function CountUp({ value, duration = 1100, className = "" }: { value: string; duration?: number; className?: string }) {
  const m = /^(\d+)(.*)$/.exec(value);
  const target = m ? Number(m[1]) : NaN;
  const suffix = m ? m[2] : "";
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setN(target), 0);
      return () => clearTimeout(t);
    }
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(target * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [target, duration]);

  if (Number.isNaN(target)) return <span className={className}>{value}</span>;
  return <span ref={ref} className={className}>{n}{suffix}</span>;
}
