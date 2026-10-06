import { z } from "zod";
import { QUESTION_BY_ID } from "@/data/questions";
import { TOPIC_BY_ID } from "@/data/topics";

/**
 * Validação do envio anônimo de estatísticas.
 *
 * `.strict()` rejeita QUALQUER campo não previsto (nome, email, IP, userAgent,
 * fingerprint, etc.). Isso é testado.
 */
export const AnswerSchema = z
  .object({
    questionId: z.string().min(1),
    optionIds: z.array(z.string().min(1)).min(1).max(10),
  })
  .strict();

export const PrioritySchema = z
  .object({
    topicId: z.string().min(1),
    level: z.number().int().min(0).max(4),
  })
  .strict();

export const AgeRangeSchema = z.enum(["16-24", "25-34", "35-44", "45-59", "60+", "prefiro-nao-responder"]);
export const RegionSchema = z.enum(["norte", "nordeste", "centro-oeste", "sudeste", "sul", "exterior", "prefiro-nao-responder"]);

export const SubmissionSchema = z
  .object({
    methodologyVersion: z.string().min(1),
    answers: z.array(AnswerSchema).min(1).max(200),
    topicPriorities: z.array(PrioritySchema).max(50),
    optionalAgeRange: AgeRangeSchema.nullable().optional(),
    optionalRegion: RegionSchema.nullable().optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    for (const [i, a] of value.answers.entries()) {
      const q = QUESTION_BY_ID[a.questionId];
      if (!q) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["answers", i, "questionId"], message: "Pergunta desconhecida." });
        continue;
      }
      const valid = new Set(q.options.map((o) => o.id));
      if (!a.optionIds.every((id) => valid.has(id))) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["answers", i, "optionIds"], message: "Alternativa não pertence à pergunta." });
      }
      if (q.kind !== "MULTI_CHOICE" && a.optionIds.length > 1) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["answers", i, "optionIds"], message: "Pergunta aceita apenas uma alternativa." });
      }
    }
    for (const [i, p] of value.topicPriorities.entries()) {
      if (!TOPIC_BY_ID[p.topicId]) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["topicPriorities", i, "topicId"], message: "Tema desconhecido." });
      }
    }
  });

export type SubmissionInput = z.infer<typeof SubmissionSchema>;

/** Avaliação anônima da pesquisa: nota de 1 a 5 e se ajudou na decisão. */
export const FeedbackSchema = z
  .object({
    methodologyVersion: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    helpedDecision: z.boolean().nullable().optional(),
  })
  .strict();

export type FeedbackInput = z.infer<typeof FeedbackSchema>;
