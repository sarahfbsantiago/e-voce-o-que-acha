import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";
import { MIN_AGGREGATE_GROUP_SIZE } from "@/domain/aggregates";
import { STATISTICS_DISCLAIMER } from "@/domain/neutrality";
import { RevokeConsent } from "@/components/RevokeConsent";

export const metadata: Metadata = { title: "Privacidade e dados" };

export default function PrivacidadePage() {
  return (
    <div className="container-page py-7 md:py-16 max-w-3xl prose-vd">
      <PageTitle eyebrow="Seus dados" tone="gold" lead="Em linguagem simples: o que coletamos, o que não coletamos e como você revoga o consentimento.">Privacidade e dados</PageTitle>

      <div className="not-prose grid gap-4 sm:grid-cols-3 mb-6">
        {[
          ["Aceite para participar", "Para responder, é preciso concordar com o uso anônimo dos dados em nível de pesquisa.", "border-t-accent"],
          ["Sem identificação", "Nunca pedimos nome, email, documento, endereço ou IP.", "border-t-purple"],
          ["Você pode revogar", "O consentimento pode ser retirado a qualquer momento, aqui nesta página.", "border-t-mint"],
        ].map(([title, text, tone], i) => (
          <section key={title} className={`card animate-fade-up p-5 border-t-4 shadow-sm ${tone}`} style={{ animationDelay: `${100 + i * 90}ms` }}>
            <h2 className="font-semibold text-base">{title}</h2>
            <p className="mt-1.5 text-sm text-ink-2 leading-relaxed">{text}</p>
          </section>
        ))}
      </div>

      <h2>Onde ficam as suas respostas</h2>
      <p>No seu navegador, para montar o seu relatório. Para participar do questionário, é preciso concordar com o uso anônimo dos dados em nível de pesquisa, na tela antes das perguntas. Com esse aceite, uma cópia anônima é enviada uma única vez, ao abrir o relatório. Base legal: consentimento (LGPD, art. 7º, I), informado com destaque como condição para participar (art. 9º, § 3º).</p>

      <h2>O que coletamos, com o seu aceite</h2>
      <ul>
        <li>As alternativas marcadas em cada pergunta.</li>
        <li>A importância que você deu a cada tema.</li>
        <li>O resultado do seu relatório: com qual candidato, Lula ou Flávio Bolsonaro, suas respostas ficaram mais próximas. Ele é calculado a partir das respostas, com a mesma conta pública do site.</li>
        <li>Opcionalmente, faixa etária e região do Brasil, em categorias amplas.</li>
        <li>A versão da metodologia e a data do envio.</li>
        <li>A avaliação da pesquisa, se você enviar: nota de 1 a 5 e se ela ajudou na sua decisão.</li>
      </ul>

      <h2>O que não coletamos</h2>
      <ul>
        <li>Nome, email, telefone, CPF, documento, endereço, CEP, cidade, conta em rede social ou data de nascimento exata.</li>
        <li>Endereço IP ou user agent em campo de aplicação.</li>
        <li>Fingerprint do navegador, cookies de publicidade ou dados de outras páginas.</li>
        <li>Sexo, raça, religião ou renda. Esses campos não existem no formulário.</li>
      </ul>

      <h2>Por que coletamos</h2>
      <p>Somente para estatísticas agregadas, em nível de pesquisa: quantas pessoas responderam cada pergunta, percentual por alternativa, distribuição de prioridades, quantidade de respostas “não sei”, proporção de relatórios mais próximos de cada candidato, notas da pesquisa e se ela ajudou na decisão, e evolução ao longo do tempo. Esses números não são pesquisa eleitoral nem intenção de voto. Os dados não são usados para propaganda personalizada nem para recomendação política individual.</p>
      <p className="text-sm">{STATISTICS_DISCLAIMER}</p>

      <h2>Como agregamos</h2>
      <p>Recortes com menos de {MIN_AGGREGATE_GROUP_SIZE} respostas não são exibidos. O painel de estatísticas é privado, mostra apenas agregações e nunca registros individuais. Percentuais são sempre “% das respostas”, nunca “% dos brasileiros”.</p>

      <h2>Por quanto tempo mantemos</h2>
      <p>Os envios anônimos são mantidos enquanto a pesquisa estiver ativa e, depois, apenas em forma agregada. Se a infraestrutura de hospedagem gerar logs técnicos com IP automaticamente, eles ficam fora da aplicação e devem ter a menor retenção possível; isso está documentado no README do projeto.</p>

      <h2>Quais tecnologias usamos</h2>
      <p>Armazenamento local do navegador (localStorage) para as suas respostas; um banco de dados PostgreSQL para os envios anônimos; nenhum serviço de analytics de terceiros.</p>

      <h2>Como revogar</h2>
      <p>Quem não concorda não participa do questionário. Faixa etária e região são opcionais e não informá-las nunca impede a participação. O envio acontece uma única vez, ao abrir o relatório. Você pode revogar o consentimento aqui; como os envios são anônimos, não há como identificar e apagar um envio específico, mas nada novo é enviado depois da revogação, e para responder de novo é preciso aceitar outra vez:</p>
      <RevokeConsent />
    </div>
  );
}
