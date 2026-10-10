import { getPrisma } from "@/lib/prisma";
import { dataSourceMode } from "@/lib/env";

/** Foto de personagem: a enviada pelo admin (banco) ou, se não houver, o arquivo original em /historia. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug.replace(/[^a-z0-9-]/gi, "");
  if (dataSourceMode() === "prisma") {
    const img = await getPrisma().historyImage.findUnique({ where: { slug } }).catch(() => null);
    if (img) return new Response(new Uint8Array(img.data), { headers: { "content-type": img.mime, "cache-control": "public, max-age=31536000, immutable" } });
  }
  // endereço relativo: atrás do proxy, req.url aponta para o servidor interno
  return new Response(null, { status: 307, headers: { Location: `/historia/${slug}.jpg` } });
}
