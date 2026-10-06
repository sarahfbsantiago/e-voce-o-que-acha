import { dataSourceMode } from "@/lib/env";
import type { ContentRepository, StatsRepository } from "./types";
import { disabledStatsRepository, staticContentRepository } from "./static";

export type { ContentRepository, StatsRepository } from "./types";
export { StatsUnavailableError } from "./types";

/**
 * Seleciona a implementação do repositório conforme o ambiente.
 * O import do Prisma é dinâmico para que o modo estático funcione sem banco.
 */
export async function getContentRepository(): Promise<ContentRepository> {
  if (dataSourceMode() === "prisma") {
    const mod = await import("./prisma");
    return mod.prismaContentRepository;
  }
  return staticContentRepository;
}

export async function getStatsRepository(): Promise<StatsRepository> {
  if (dataSourceMode() === "prisma") {
    const mod = await import("./prisma");
    return mod.prismaStatsRepository;
  }
  return disabledStatsRepository;
}
