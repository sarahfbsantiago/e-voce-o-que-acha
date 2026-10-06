/** Cinco áreas que agrupam os 12 temas nas pizzas do relatório (menos fatias, leitura mais rápida). */
export type AreaId = "economia" | "social" | "seguranca" | "ambiente-tec" | "instituicoes";

export const AREA_GROUPS: { id: AreaId; label: string; color: string; topicIds: string[] }[] = [
  { id: "economia", label: "Economia e trabalho", color: "#8b5cf6", topicIds: ["t01", "t02", "t09"] },
  { id: "social", label: "Social: saúde, educação e renda", color: "#22c55e", topicIds: ["t03", "t04", "t05"] },
  { id: "seguranca", label: "Segurança", color: "#facc15", topicIds: ["t06", "t07"] },
  { id: "ambiente-tec", label: "Ambiente e tecnologia", color: "#3b82f6", topicIds: ["t08", "t10"] },
  { id: "instituicoes", label: "Instituições e mundo", color: "#ec4899", topicIds: ["t11", "t12"] },
];

export function groupOfTopic(topicId: string) {
  return AREA_GROUPS.find((g) => g.topicIds.includes(topicId)) ?? AREA_GROUPS[AREA_GROUPS.length - 1];
}
