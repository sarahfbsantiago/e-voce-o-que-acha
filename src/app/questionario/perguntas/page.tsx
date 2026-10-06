import type { Metadata } from "next";
import { QuestionnaireFlow } from "@/components/QuestionnaireFlow";

export const metadata: Metadata = { title: "Perguntas" };

export default function PerguntasPage() {
  return <QuestionnaireFlow />;
}
