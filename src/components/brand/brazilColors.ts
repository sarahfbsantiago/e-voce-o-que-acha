import type { Region, StatePath } from "./brazilShape";

/** Uma cor viva por região. Nenhuma domina o mapa. */
export const REGION_COLORS: Record<Region, string> = {
  norte: "#22c55e",       // verde
  nordeste: "#facc15",    // amarelo
  centroOeste: "#ec4899", // rosa
  sudeste: "#8b5cf6",     // roxo
  sul: "#3b82f6",         // azul
};

export function stateColor(s: StatePath): string {
  return REGION_COLORS[s.region];
}

export const MAP_COLORS: string[] = Object.values(REGION_COLORS);
