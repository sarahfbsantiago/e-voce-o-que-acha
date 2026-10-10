/**
 * Ilustrações (desenhadas aqui, sem imagens de terceiros) das telas do Google Authenticator,
 * para o passo a passo do admin.
 */
function Phone({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <figure className="flex flex-col items-center gap-2 print:break-inside-avoid">
      <div className="relative h-[250px] w-[136px] rounded-[22px] bg-[#1c1c1a] p-[7px] shadow-md">
        <div className="absolute left-1/2 top-[9px] h-[5px] w-10 -translate-x-1/2 rounded-full bg-[#3a3a36]" />
        <div className="h-full w-full overflow-hidden rounded-[16px] bg-white pt-4 text-[8.5px] text-[#202124]">{children}</div>
      </div>
      <figcaption className="max-w-[150px] text-center text-xs font-semibold text-ink-2"><span className="mr-1 inline-grid h-5 w-5 place-items-center rounded-full bg-[#15803d] text-[10px] font-bold text-white">{n}</span>{title}</figcaption>
    </figure>
  );
}
const Bar = ({ t }: { t: string }) => <p className="border-b border-[#e8eaed] px-2 pb-1 text-[9px] font-bold">{t}</p>;
const Field = ({ l, v, hl }: { l: string; v: string; hl?: boolean }) => (
  <div className={`mx-2 mt-2 rounded border px-1.5 py-1 ${hl ? "border-[#15803d] bg-[#15803d0f]" : "border-[#dadce0]"}`}><p className="text-[7px] text-[#5f6368]">{l}</p><p className="font-semibold">{v}</p></div>
);

export function AuthIllustrations() {
  return (
    <div className="flex flex-wrap justify-center gap-4 rounded-2xl bg-paper/60 p-4 ring-1 ring-line">
      <Phone n={1} title="Abra o app e toque no +">
        <Bar t="Authenticator" />
        <div className="space-y-2 p-2 text-[#5f6368]"><div className="h-6 rounded bg-[#f1f3f4]" /><div className="h-6 rounded bg-[#f1f3f4]" /></div>
        <div className="absolute bottom-6 right-5 grid h-9 w-9 place-items-center rounded-xl bg-[#c2e7ff] text-lg font-bold text-[#001d35] ring-4 ring-[#15803d]/40">+</div>
      </Phone>
      <Phone n={2} title="Escolha “Inserir chave de configuração”">
        <Bar t="Adicionar código" />
        <div className="mt-6 space-y-2 px-2">
          <p className="rounded-full bg-[#f1f3f4] px-2 py-1.5 text-center">Ler código QR</p>
          <p className="rounded-full bg-[#15803d] px-2 py-1.5 text-center font-bold text-white ring-2 ring-[#15803d]/30">Inserir chave de configuração</p>
        </div>
      </Phone>
      <Phone n={3} title="Preencha conta e chave; escolha “Baseada no tempo”">
        <Bar t="Inserir detalhes da conta" />
        <Field l="Conta" v="E Você (admin)" />
        <Field l="Sua chave" v="ABCD EFGH IJKL…" hl />
        <Field l="Tipo de chave" v="Baseada no tempo" />
        <p className="mx-2 mt-2 rounded-full bg-[#1a73e8] py-1 text-center font-bold text-white">Adicionar</p>
      </Phone>
      <Phone n={4} title="Use o código de 6 números para entrar e aprovar">
        <Bar t="Authenticator" />
        <div className="mx-2 mt-3 rounded-lg bg-[#15803d0f] p-2 ring-1 ring-[#15803d]/30">
          <p className="text-[7px] text-[#5f6368]">E Você (admin)</p>
          <p className="whitespace-nowrap text-[15px] font-bold tracking-[0.08em] text-[#1a73e8]">482 913</p>
          <div className="mt-1 h-1 rounded-full bg-[#dadce0]"><div className="h-1 w-2/3 rounded-full bg-[#1a73e8]" /></div>
          <p className="mt-1 text-[7px] text-[#5f6368]">muda a cada 30 s</p>
        </div>
      </Phone>
    </div>
  );
}
