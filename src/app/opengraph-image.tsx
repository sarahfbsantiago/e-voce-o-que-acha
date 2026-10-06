import { ImageResponse } from "next/og";
import { BRAZIL_H, BRAZIL_STATES, BRAZIL_W } from "@/components/brand/brazilShape";
import { REGION_COLORS } from "@/components/brand/brazilColors";

export const runtime = "edge";
export const alt = "Você decide. Nós organizamos as evidências. Vote com consciência.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento (WhatsApp, Instagram, X, LinkedIn): mapa do Brasil por região e o nome do site. */
export default function OpenGraphImage() {
  const mapH = 440;
  const mapW = (mapH * BRAZIL_W) / BRAZIL_H;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "linear-gradient(135deg, #f7f6f3 0%, #ede6fb 55%, #e3f4ea 100%)", fontFamily: "ui-monospace, Menlo, monospace", color: "#1c1c1a" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px 0 72px 80px", width: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#562f9f" }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "#6d3fc4" }} />
            Eleições 2026
          </div>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700, lineHeight: 1, marginTop: 28, letterSpacing: -3 }}>Você decide</div>
          <div style={{ display: "flex", fontSize: 30, lineHeight: 1.35, marginTop: 28, color: "#4a4a46" }}>Nós organizamos as evidências. Vote com consciência.</div>
          <div style={{ display: "flex", fontSize: 22, lineHeight: 1.4, marginTop: 36, color: "#7a7a74" }}>52 perguntas · sem nome de candidato · fontes no final</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
          <svg width={mapW} height={mapH} viewBox={`0 0 ${BRAZIL_W} ${BRAZIL_H}`}>
            {BRAZIL_STATES.map((s) => (
              <path key={s.name} d={s.d} fill={REGION_COLORS[s.region]} stroke="#ffffff" strokeWidth={0.8} strokeLinejoin="round" />
            ))}
          </svg>
        </div>
      </div>
    ),
    { ...size },
  );
}
