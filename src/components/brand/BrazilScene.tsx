"use client";

import { useEffect, useRef } from "react";
import { BRAZIL_H, BRAZIL_STATES, BRAZIL_W } from "./brazilShape";
import { MAP_COLORS, stateColor } from "./brazilColors";

type Dot = {
  fx: number; fy: number;       // posição no mapa (px, relativa ao canto da âncora)
  u: number; v: number;         // posição dispersa, fração da viewport (0..1)
  amp: number; ph: number; fq: number; // deriva lenta quando disperso
  delay: number;                // escalonamento ao formar (0..1)
  wave: number;                 // distância ao centro, para a onda de dispersão (0..1)
  swirl: number;                // curvatura da trajetória
  ox: number; oy: number; vx: number; vy: number; // deslocamento pelo ponteiro
  r: number;
  color: string;
  dust: boolean;
  _x: number; _y: number;       // posição desenhada no frame
};

type Props = {
  /** id do elemento onde o mapa se forma; se não existir na página, os pontos ficam só dispersos */
  anchorId: string;
  /** largura do mapa em px (deve bater com a âncora) */
  size?: number;
  /** espaçamento entre pontos do mapa, px */
  spacing?: number;
  /** quantidade de poeira solta pela página */
  dust?: number;
};

const FORM = 1.7, HOLD = 4.5, RELEASE = 1.4, FREE = 1.9;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * Cena em pontilhismo de página inteira (canvas fixo atrás do conteúdo), montada no layout raiz.
 * Onde existe a âncora (home): ciclo contínuo — pontos espalhados → convergem e formam o mapa →
 * seguram alguns segundos (reagindo ao ponteiro) → se soltam em onda e dispersam → repete.
 * Nas outras páginas: só a poeira dispersa, mais discreta, com parallax leve ao rolar.
 * Com prefers-reduced-motion a cena não roda (a âncora mostra a marca estática).
 */
export function BrazilScene({ anchorId, size = 220, spacing = 3, dust = 240 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth, H = window.innerHeight;
    // celular: menos pontos e sem parallax (não há mouse)
    const small = W < 640 || window.matchMedia("(pointer: coarse)").matches;
    const step = small ? spacing + 1 : spacing;
    const dustCount = small ? Math.round(dust / 2) : dust;
    const parallax = small ? 0 : 1;
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    };
    resize();

    // 1) silhueta do mapa, cada estado com sua cor, divisas recortadas
    const sh = Math.round((size * BRAZIL_H) / BRAZIL_W);
    const off = document.createElement("canvas");
    off.width = Math.ceil(size); off.height = sh;
    const octx = off.getContext("2d", { willReadFrequently: true });
    if (!octx) return;
    const scale = size / BRAZIL_W;
    octx.scale(scale, scale);
    const paths = BRAZIL_STATES.map((s) => ({ p: new Path2D(s.d), color: stateColor(s) }));
    for (const { p, color } of paths) { octx.fillStyle = color; octx.fill(p); }
    octx.globalCompositeOperation = "destination-out";
    octx.lineWidth = 1.1 / scale;
    octx.strokeStyle = "#000";
    for (const { p } of paths) octx.stroke(p);
    octx.globalCompositeOperation = "source-over";
    const img = octx.getImageData(0, 0, off.width, off.height).data;

    const dots: Dot[] = [];
    const mk = (fx: number, fy: number, r: number, color: string, isDust: boolean): Dot => ({
      fx, fy,
      u: Math.random(), v: Math.random(),
      amp: 10 + Math.random() * 26, ph: Math.random() * Math.PI * 2, fq: 0.15 + Math.random() * 0.25,
      delay: Math.random(),
      wave: Math.hypot(fx - size / 2, fy - sh / 2) / Math.hypot(size / 2, sh / 2),
      swirl: (Math.random() - 0.5) * 160,
      ox: 0, oy: 0, vx: 0, vy: 0,
      r, color, dust: isDust, _x: 0, _y: 0,
    });
    for (let gy = 0; gy < sh; gy += step) {
      for (let gx = 0; gx < size; gx += step) {
        const jx = gx + (Math.random() - 0.5) * step * 0.5;
        const jy = gy + (Math.random() - 0.5) * step * 0.5;
        const px = Math.round(jx), py = Math.round(jy);
        if (px < 0 || py < 0 || px >= off.width || py >= off.height) continue;
        const i = (py * off.width + px) * 4;
        if (img[i + 3] < 128) continue;
        dots.push(mk(jx, jy, step * 0.40 + Math.random() * step * 0.08, `rgb(${img[i]} ${img[i + 1]} ${img[i + 2]})`, false));
      }
    }
    const DUST_COLORS = MAP_COLORS;
    for (let i = 0; i < dustCount; i++) dots.push(mk(0, 0, 0.8 + Math.random() * 1.4, DUST_COLORS[i % DUST_COLORS.length], true));

    // 2) ponteiro
    const pointer = { x: -9999, y: -9999, nx: 0, ny: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX; pointer.y = e.clientY;
      pointer.nx = (e.clientX / W - 0.5) * 2; pointer.ny = (e.clientY / H - 0.5) * 2;
    };
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999; };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("blur", onLeave);
    document.addEventListener("pointerleave", onLeave);

    // 3) loop
    const R = Math.max(70, size * 0.45);
    let phase: 0 | 1 | 2 | 3 = 0; // 0 formar, 1 segurar, 2 soltar, 3 livre
    const DUR = [FORM, HOLD, RELEASE, FREE];
    let pt = 0, t = 0, last = performance.now(), raf = 0, tiltX = 0, tiltY = 0, hadAnchor = false;
    const buckets = new Map<string, Dot[]>();

    const tick = (now: number) => {
      const dtMs = Math.min(50, now - last); last = now;
      const dt = dtMs / 16.67; const ds = dtMs / 1000;
      t += ds;

      // a âncora pode aparecer/sumir com a navegação entre páginas
      const anchor = document.getElementById(anchorId);
      const hasAnchor = !!anchor;
      if (hasAnchor && !hadAnchor) { phase = 0; pt = 0; }
      hadAnchor = hasAnchor;
      if (hasAnchor) {
        pt += ds;
        if (pt >= DUR[phase]) { pt -= DUR[phase]; phase = ((phase + 1) % 4) as 0 | 1 | 2 | 3; }
      } else {
        phase = 3; pt = 0;
      }

      const rect = anchor ? anchor.getBoundingClientRect() : { left: 0, top: 0 };
      tiltX += ((pointer.x > -1 ? pointer.nx * 12 * parallax : 0) - tiltX) * 0.05 * dt;
      tiltY += ((pointer.y > -1 ? pointer.ny * 8 * parallax : 0) - tiltY) * 0.05 * dt;
      const ax = rect.left + tiltX, ay = rect.top + tiltY;
      const scrollShift = window.scrollY * 0.06 * parallax;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      buckets.clear();

      for (const d of dots) {
        const sx = d.u * W + Math.sin(t * d.fq + d.ph) * d.amp;
        const syRaw = d.v * H + Math.cos(t * d.fq * 0.8 + d.ph) * d.amp - scrollShift;
        const sy = ((syRaw % H) + H) % H;
        let mix = 0;
        if (!d.dust) {
          if (phase === 0) mix = ease(clamp01((pt - d.delay * 0.7) / (FORM - 0.7)));
          else if (phase === 1) mix = 1;
          else if (phase === 2) mix = 1 - ease(clamp01((pt - d.wave * 0.6) / (RELEASE - 0.6)));
        }
        const tx = ax + d.fx, ty = ay + d.fy;
        const bulge = Math.sin(mix * Math.PI) * d.swirl;
        let x = sx + (tx - sx) * mix + bulge * 0.35;
        let y = sy + (ty - sy) * mix - bulge * 0.25;

        const dx = x - pointer.x, dy = y - pointer.y;
        const dist = Math.hypot(dx, dy);
        let fx = -d.ox * 0.08, fy = -d.oy * 0.08;
        if (dist < R && dist > 0.001) {
          const f = (1 - dist / R) ** 2 * (d.dust ? 1.2 : 3.4);
          fx += (dx / dist) * f; fy += (dy / dist) * f;
        }
        d.vx = (d.vx + fx * dt) * 0.85; d.vy = (d.vy + fy * dt) * 0.85;
        d.ox += d.vx * dt; d.oy += d.vy * dt;
        x += d.ox; y += d.oy;
        d._x = x; d._y = y;

        const alpha = d.dust ? 0.32 : hasAnchor ? 0.42 + 0.58 * mix : 0.26;
        const key = `${d.color}|${Math.round(alpha * 6)}`;
        let b = buckets.get(key);
        if (!b) { b = []; buckets.set(key, b); }
        b.push(d);
      }
      for (const [key, list] of buckets) {
        const [color, a] = key.split("|");
        ctx.fillStyle = color;
        ctx.globalAlpha = Number(a) / 6;
        ctx.beginPath();
        for (const d of list) { ctx.moveTo(d._x + d.r, d._y); ctx.arc(d._x, d._y, d.r, 0, Math.PI * 2); }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; }
      else if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [anchorId, size, spacing, dust]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full motion-reduce:hidden" />;
}
