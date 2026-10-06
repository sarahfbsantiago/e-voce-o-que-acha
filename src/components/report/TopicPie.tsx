"use client";

import type { TopicSection } from "@/domain/user-summary";
import { Donut, type Slice } from "./Donut";
import { AREA_GROUPS } from "./areaGroups";

/** Ordem fixa de cores por tema (identidade) para os cartões de proximidade. */
export const TOPIC_COLORS = [
  "#8b5cf6", "#ec4899", "#22c55e", "#facc15", "#3b82f6", "#f97316",
  "#14b8a6", "#d946ef", "#84cc16", "#06b6d4", "#6366f1", "#f43f5e",
];

/**
 * Pizza das áreas: os 12 temas agrupados em 5 áreas, cada fatia do tamanho da importância
 * que a pessoa declarou (soma dos níveis dos temas da área).
 */
export function TopicPie({ sections }: { sections: TopicSection[] }) {
  const slices: Slice[] = AREA_GROUPS.map((g) => {
    const secs = sections.filter((s) => g.topicIds.includes(s.topic.id));
    const value = secs.reduce((a, s) => a + (s.priorityLevel ?? 0), 0);
    const detail = secs.map((s) => s.topic.name.split(",")[0]).join(" · ");
    return { id: g.id, label: g.label, value, color: g.color, detail };
  });
  return <Donut slices={slices} caption="Seu perfil por área" hint="Cada fatia é uma área, do tamanho da importância que você deu aos temas dela. Passe o mouse ou toque para ver." />;
}
