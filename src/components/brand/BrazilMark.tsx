import { BRAZIL_H, BRAZIL_STATES, BRAZIL_W } from "./brazilShape";
import { stateColor } from "./brazilColors";

/** Marca estática (SVG) do mapa do Brasil, cada estado com sua cor, para header, rodapé e ícones. */
export function BrazilMark({ size = 28, className = "", title = "Você decide" }: { size?: number; className?: string; title?: string }) {
  const h = Math.round((size * BRAZIL_H) / BRAZIL_W);
  return (
    <svg width={size} height={h} viewBox={`0 0 ${BRAZIL_W} ${BRAZIL_H}`} role="img" aria-label={title} className={className}>
      {BRAZIL_STATES.map((s) => (
        <path key={s.name} d={s.d} fill={stateColor(s)} stroke="#ffffff" strokeWidth={size < 60 ? 0 : 0.8} strokeLinejoin="round" />
      ))}
    </svg>
  );
}
