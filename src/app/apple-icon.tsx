import { ImageResponse } from "next/og";
import { BRAZIL_H, BRAZIL_STATES, BRAZIL_W } from "@/components/brand/brazilShape";
import { REGION_COLORS } from "@/components/brand/brazilColors";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Ícone para iPhone/Android (tela inicial): mapa por região sobre fundo roxo claro. */
export default function AppleIcon() {
  const h = 136;
  const w = (h * BRAZIL_W) / BRAZIL_H;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ede6fb", borderRadius: 36 }}>
        <svg width={w} height={h} viewBox={`0 0 ${BRAZIL_W} ${BRAZIL_H}`}>
          {BRAZIL_STATES.map((s) => <path key={s.name} d={s.d} fill={REGION_COLORS[s.region]} />)}
        </svg>
      </div>
    ),
    { ...size },
  );
}
