import { ImageResponse } from "next/og";
import { BRAZIL_H, BRAZIL_STATES, BRAZIL_W } from "@/components/brand/brazilShape";
import { REGION_COLORS } from "@/components/brand/brazilColors";

export const runtime = "nodejs";
export const alt = "Admin · E Você, O Que Acha?. Área restrita do painel.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento do admin: a mesma capa do site com o selo ADMIN. */
export default function OpenGraphImage() {
  const mapH = 440;
  const mapW = (mapH * BRAZIL_W) / BRAZIL_H;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "linear-gradient(135deg, #f7f6f3 0%, #ede6fb 55%, #e3f4ea 100%)", fontFamily: "ui-monospace, Menlo, monospace", color: "#1c1c1a" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px 0 72px 80px", width: 640 }}>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 30, fontWeight: 800, letterSpacing: 6, color: "#ffffff", background: "linear-gradient(90deg, #3b1f7a, #6d3fc4, #2563eb)", borderRadius: 16, padding: "12px 26px" }}>
              ADMIN
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 80, fontWeight: 700, lineHeight: 1.05, marginTop: 28, letterSpacing: -2 }}>E Você, O Que Acha?</div>
          <div style={{ display: "flex", fontSize: 30, lineHeight: 1.35, marginTop: 28, color: "#4a4a46" }}>Área restrita do painel da pesquisa.</div>
          <div style={{ display: "flex", fontSize: 22, lineHeight: 1.4, marginTop: 36, color: "#7a7a74" }}>Acesso com código do Google Authenticator</div>
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
