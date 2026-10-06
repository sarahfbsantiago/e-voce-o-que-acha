import { getContentRepository } from "@/lib/repository";
import { json } from "@/lib/api";

/** Todas as versões, inclusive encerradas. Nenhuma é apagada. */
export async function GET() {
  const repo = await getContentRepository();
  return json({ versions: await repo.getMethodologyVersions() });
}

export const dynamic = "force-dynamic";
