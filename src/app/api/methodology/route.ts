import { publicChangelogEntries } from "@/lib/live-config-server";
import { getContentRepository } from "@/lib/repository";
import { json } from "@/lib/api";
import { POLITICAL_DATA_UPDATED_AT } from "@/data/methodology";
import { EVIDENCE_CLASSIFICATION_LABELS, EVIDENCE_STRENGTH_LABELS, SOURCE_LEGEND_LABELS } from "@/domain/types";
import { COMMON_EXCLUSION_CRITERIA, COMMON_INCLUSION_CRITERIA } from "@/data/research-protocols";

export async function GET() {
  const repo = await getContentRepository();
  const versions = await repo.getMethodologyVersions();
  const base = versions.find((v) => v.effectiveUntil === null) ?? versions[versions.length - 1];
  const extra = await publicChangelogEntries();
  const current = base ? { ...base, changeLog: [...base.changeLog, ...extra] } : base;
  return json({
    current,
    politicalDataUpdatedAt: POLITICAL_DATA_UPDATED_AT,
    evidenceStrength: EVIDENCE_STRENGTH_LABELS,
    evidenceClassification: EVIDENCE_CLASSIFICATION_LABELS,
    sourceLegends: SOURCE_LEGEND_LABELS,
    inclusionCriteria: COMMON_INCLUSION_CRITERIA,
    exclusionCriteria: COMMON_EXCLUSION_CRITERIA,
  });
}

export const dynamic = "force-dynamic";
