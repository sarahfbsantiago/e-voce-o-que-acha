import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ADMIN_SESSION_MAX_MS, createSessionValue, isValidSessionValue } from "@/lib/admin-auth";

describe("sessão do admin", () => {
  const prev = process.env.ADMIN_TOKEN;
  beforeEach(() => { process.env.ADMIN_TOKEN = "token-de-teste-com-mais-de-16-chars"; });
  afterEach(() => { process.env.ADMIN_TOKEN = prev; });

  it("o cookie não contém o token e vale por no máximo 1 hora", () => {
    const now = 1_800_000_000_000;
    const v = createSessionValue(now)!;
    expect(v).not.toContain(process.env.ADMIN_TOKEN);
    expect(isValidSessionValue(v, now)).toBe(true);
    expect(isValidSessionValue(v, now + ADMIN_SESSION_MAX_MS - 1)).toBe(true);
    expect(isValidSessionValue(v, now + ADMIN_SESSION_MAX_MS + 1)).toBe(false);
  });
  it("valores forjados, o token cru e assinaturas de outro segredo são rejeitados", () => {
    const now = 1_800_000_000_000;
    const v = createSessionValue(now)!;
    expect(isValidSessionValue(process.env.ADMIN_TOKEN, now)).toBe(false);
    expect(isValidSessionValue(`${now}.deadbeef`, now)).toBe(false);
    expect(isValidSessionValue(v.replace(/^\d+/, String(now + 60_000)), now + 60_000)).toBe(false);
    process.env.ADMIN_TOKEN = "outro-segredo-com-mais-de-16-chars";
    expect(isValidSessionValue(v, now)).toBe(false);
  });
});

describe("Google Authenticator (TOTP)", () => {
  it("bate com o vetor de teste da RFC 6238 (SHA1)", async () => {
    const { base32Encode, totpAt } = await import("@/lib/totp");
    const secret = base32Encode(Buffer.from("12345678901234567890"));
    expect(totpAt(secret, 59_000)).toBe("287082");
    expect(totpAt(secret, 1_111_111_109_000)).toBe("081804");
  });
  it("aceita o código atual e o vizinho, recusa outros", async () => {
    const { generateTotpSecret, totpAt, verifyTotp } = await import("@/lib/totp");
    const s = generateTotpSecret();
    const now = 1_800_000_000_000;
    expect(verifyTotp(s, totpAt(s, now), now)).not.toBeNull();
    expect(verifyTotp(s, totpAt(s, now - 30_000), now)).not.toBeNull();
    expect(verifyTotp(s, totpAt(s, now - 120_000), now)).toBeNull();
    expect(verifyTotp(s, "12345", now)).toBeNull();
  });
});
