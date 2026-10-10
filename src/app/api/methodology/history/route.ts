import { publicChangelogEntries } from "@/lib/live-config-server";
import { getContentRepository } from "@/lib/repository";
import { json } from "@/lib/api";

/** Todas as versões, inclusive encerradas. Nenhuma é apagada. */
export async function GET() {
  const repo = await getContentRepository();
  const versions = await repo.getMethodologyVersions();
  const extra = await publicChangelogEntries();
  const i = versions.findIndex((v) => v.effectiveUntil === null);
  if (i >= 0 && extra.length) versions[i] = { ...versions[i], changeLog: [...versions[i].changeLog, ...extra] };
  return json({ versions });
}

export const dynamic = "force-dynamic";
