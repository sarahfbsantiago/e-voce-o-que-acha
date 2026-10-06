"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  className?: string;
  /** ms por letra ao digitar */
  speed?: number;
  /** ms parado com o texto completo antes de recomeçar */
  hold?: number;
  /** ms vazio (cursor piscando) antes de digitar de novo */
  restartDelay?: number;
  /** ms antes da primeira digitação */
  startDelay?: number;
};

/**
 * Título com efeito de digitação em loop infinito:
 * digita letra por letra → espera `hold` ms → limpa → digita de novo.
 * - O texto completo fica num span só para leitores de tela e crawlers.
 * - Com prefers-reduced-motion mostra o texto inteiro, sem animar.
 */
export function TypewriterTitle({
  text,
  className = "",
  speed = 110,
  hold = 3000,
  restartDelay = 500,
  startDelay = 300,
}: Props) {
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      });

    (async () => {
      await wait(0);
      if (cancelled) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setCount(text.length);
        return;
      }
      await wait(startDelay);
      while (!cancelled) {
        setPaused(false);
        for (let i = 1; i <= text.length; i++) {
          if (cancelled) return;
          setCount(i);
          await wait(speed);
        }
        setPaused(true);
        await wait(hold);
        if (cancelled) return;
        setCount(0);
        await wait(restartDelay);
      }
    })();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [text, speed, hold, restartDelay, startDelay]);

  return (
    <h1 className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block min-h-[1.2em]">
        {text.slice(0, count)}
        <span className={`type-caret ${paused ? "type-caret-blink" : ""}`} />
      </span>
    </h1>
  );
}
