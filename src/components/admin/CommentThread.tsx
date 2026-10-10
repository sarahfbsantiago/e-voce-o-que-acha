import { addCommentAction } from "@/app/admin/comentarios/actions";
import { Icon } from "@/components/admin/Icon";

export interface AdminCommentRow { id: number; createdAt: Date; author: string; body: string }

const input = "w-full rounded-lg border border-line bg-surface px-2.5 py-2 text-sm focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30";
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

/** Conversa de um item: lista os comentários e o formulário (nome e comentário obrigatórios). */
export function CommentThread({ target, targetId, comments }: { target: "sugestao" | "pedido"; targetId: number; comments: AdminCommentRow[] }) {
  return (
    <div id={`c-${target}-${targetId}`} className="scroll-mt-6 space-y-2">
      <p className="flex items-center gap-1.5 text-xs font-bold text-ink-2"><Icon name="text" className="h-4 w-4 text-purple" />Comentários ({comments.length})</p>
      {comments.length ? (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-purple-soft text-[10px] font-bold text-purple-strong">{initials(c.author)}</span>
              <div className="min-w-0 flex-1 rounded-xl bg-paper/70 px-3 py-2 text-sm ring-1 ring-line">
                <p className="text-xs"><b className="text-ink">{c.author}</b> <span className="text-ink-3">· {c.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" })}</span></p>
                <p className="mt-0.5 whitespace-pre-line break-words text-ink-2">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      <form action={addCommentAction} className="grid gap-2 sm:grid-cols-[10rem_1fr_auto] sm:items-start">
        <input type="hidden" name="target" value={target} />
        <input type="hidden" name="targetId" value={targetId} />
        <input name="author" required minLength={2} maxLength={60} placeholder="Seu nome *" aria-label="Seu nome" className={input} />
        <textarea name="body" required minLength={2} maxLength={2000} rows={1} placeholder="Escreva um comentário *" aria-label="Comentário" className={`${input} min-h-[38px] resize-y`} />
        <button className="admin-press min-h-[38px] rounded-lg bg-gradient-to-r from-purple to-[#2563eb] px-3 py-2 text-xs font-bold text-white">Comentar</button>
      </form>
    </div>
  );
}
