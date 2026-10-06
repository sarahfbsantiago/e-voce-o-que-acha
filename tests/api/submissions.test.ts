import { describe, expect, it } from "vitest";
import { POST as postSubmission } from "@/app/api/survey/submissions/route";
import { POST as postFeedback } from "@/app/api/survey/feedback/route";
import { GET as getAdmin } from "@/app/api/admin/research/route";
import { SubmissionSchema } from "@/lib/validation";

const post = (path: string, body: unknown) => new Request(`http://localhost${path}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

const valid = {
  methodologyVersion: "1.0.0",
  answers: [{ questionId: "q01", optionIds: ["q01-o1"] }, { questionId: "q20", optionIds: ["q20-o2"] }],
  topicPriorities: [{ topicId: "t01", level: 3 }],
  optionalAgeRange: "25-34",
  optionalRegion: null,
};

describe("envio anônimo", () => {
  it("rejeita qualquer campo identificável", () => {
    for (const extra of [{ name: "x" }, { email: "a@b.c" }, { ip: "1.2.3.4" }, { userAgent: "ua" }, { fingerprint: "f" }, { cpf: "000" }, { phone: "1" }]) {
      expect(SubmissionSchema.safeParse({ ...valid, ...extra }).success, JSON.stringify(extra)).toBe(false);
    }
  });
  it("rejeita alternativa que não pertence à pergunta e múltipla marcação em pergunta única", () => {
    expect(SubmissionSchema.safeParse({ ...valid, answers: [{ questionId: "q01", optionIds: ["q25-o1"] }] }).success).toBe(false);
    expect(SubmissionSchema.safeParse({ ...valid, answers: [{ questionId: "q01", optionIds: ["q01-o1", "q01-o2"] }] }).success).toBe(false);
    expect(SubmissionSchema.safeParse(valid).success).toBe(true);
  });
  it("POST válido sem banco responde 503 (estatísticas indisponíveis), inválido responde 400", async () => {
    expect((await postSubmission(post("/api/survey/submissions", valid))).status).toBe(503);
    expect((await postSubmission(post("/api/survey/submissions", { ...valid, email: "x" }))).status).toBe(400);
  });
  it("feedback: nota 1–5 obrigatória, sem campos extras", async () => {
    expect((await postFeedback(post("/x", { methodologyVersion: "1.0.0", rating: 5, helpedDecision: true }))).status).toBe(503);
    expect((await postFeedback(post("/x", { methodologyVersion: "1.0.0", rating: 6 }))).status).toBe(400);
    expect((await postFeedback(post("/x", { methodologyVersion: "1.0.0", rating: 3, email: "a@b" }))).status).toBe(400);
  });
  it("painel administrativo exige token", async () => {
    expect((await getAdmin(new Request("http://localhost/api/admin/research"))).status).toBe(401);
  });
});
