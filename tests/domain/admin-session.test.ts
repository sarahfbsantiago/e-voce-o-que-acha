import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ADMIN_SESSION_IDLE_MS, createSessionValue, isValidSessionValue } from "@/lib/admin-auth";

describe("sessão do admin", () => {
  const prev = process.env.ADMIN_TOKEN;
  beforeEach(() => { process.env.ADMIN_TOKEN = "token-de-teste-com-mais-de-16-chars"; });
  afterEach(() => { process.env.ADMIN_TOKEN = prev; });

  it("o cookie não contém o token e só vale enquanto a sessão está ativa", () => {
    const now = 1_800_000_000_000;
    const v = createSessionValue(now)!;
    expect(v).not.toContain(process.env.ADMIN_TOKEN);
    expect(isValidSessionValue(v, now)).toBe(true);
    expect(isValidSessionValue(v, now + ADMIN_SESSION_IDLE_MS - 1)).toBe(true);
    expect(isValidSessionValue(v, now + ADMIN_SESSION_IDLE_MS + 1)).toBe(false);
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
