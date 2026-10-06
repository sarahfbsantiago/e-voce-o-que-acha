import type { Candidate } from "@/domain/types";

/**
 * Randomiza a ordem esquerda/direita dos candidatos por sessão, para evitar
 * associar permanentemente o primeiro lugar visual a um deles. A ordem é
 * sorteada uma vez e mantida durante toda a sessão.
 */
export function randomCandidateOrder(candidateIds: string[], random: () => number = Math.random): string[] {
  const ids = [...candidateIds];
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

export function orderCandidates(candidates: Candidate[], order: string[] | null): Candidate[] {
  if (!order || order.length === 0) return candidates;
  const idx = new Map(order.map((id, i) => [id, i]));
  return [...candidates].sort((a, b) => (idx.get(a.id) ?? 99) - (idx.get(b.id) ?? 99));
}
