import { createHmac, randomBytes } from "node:crypto";

/**
 * Códigos de 6 dígitos do Google Authenticator (TOTP, RFC 6238: HMAC-SHA1, 30 segundos).
 * Sem dependências: só o crypto do Node.
 */
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(buf: Buffer): string {
  let bits = 0, value = 0, out = "";
  for (const byte of buf) {
    value = (value << 8) | byte; bits += 8;
    while (bits >= 5) { out += B32[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(text: string): Buffer {
  const clean = text.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = 0, value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    value = (value << 5) | B32.indexOf(ch); bits += 5;
    if (bits >= 8) { out.push((value >>> (bits - 8)) & 255); bits -= 8; }
  }
  return Buffer.from(out);
}

/** Novo segredo (160 bits), em base32, para cadastrar no aplicativo. */
export function generateTotpSecret(): string {
  return base32Encode(randomBytes(20));
}

export function hotp(key: Buffer, counter: number, digits = 6): string {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const h = createHmac("sha1", key).update(msg).digest();
  const off = h[h.length - 1] & 15;
  const bin = ((h[off] & 127) << 24) | (h[off + 1] << 16) | (h[off + 2] << 8) | h[off + 3];
  return String(bin % 10 ** digits).padStart(digits, "0");
}

export const TOTP_STEP_SECONDS = 30;

export function totpAt(secret: string, now = Date.now(), digits = 6): string {
  return hotp(base32Decode(secret), Math.floor(now / 1000 / TOTP_STEP_SECONDS), digits);
}

/**
 * Confere o código aceitando um passo antes e um depois (relógio do celular um pouco adiantado ou atrasado).
 * Devolve o passo aceito (para não deixar o mesmo código ser usado duas vezes) ou null.
 */
export function verifyTotp(secret: string, code: string, now = Date.now(), window = 1): number | null {
  const clean = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(clean)) return null;
  const key = base32Decode(secret);
  const step = Math.floor(now / 1000 / TOTP_STEP_SECONDS);
  for (let d = -window; d <= window; d++) {
    const candidate = hotp(key, step + d);
    let diff = 0;
    for (let i = 0; i < 6; i++) diff |= candidate.charCodeAt(i) ^ clean.charCodeAt(i);
    if (diff === 0) return step + d;
  }
  return null;
}
