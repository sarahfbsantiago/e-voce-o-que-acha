import type { Metadata } from "next";
import { ensureLiveConfig } from "@/lib/live-config-server";
import { QuestionnaireFlow } from "@/components/QuestionnaireFlow";

export const metadata: Metadata = { title: "Perguntas" };

export default async function PerguntasPage() {
  await ensureLiveConfig();
  return <QuestionnaireFlow />;
}
