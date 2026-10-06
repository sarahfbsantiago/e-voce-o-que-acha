import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";
import { MIN_AGGREGATE_GROUP_SIZE } from "@/domain/aggregates";
import { STATISTICS_DISCLAIMER } from "@/domain/neutrality";
import { RevokeConsent } from "@/components/RevokeConsent";

export const metadata: Metadata = { title: "Privacidade e dados" };

export default function PrivacidadePage() {
  return (
    <div className="container-page py-7 md:py-16 max-w-3xl prose-vd">
      <PageTitle eyebrow="Seus dados" tone="gold" lead="Em linguagem simples: o que coletamos, o que não coletamos e como você recusa.">Privacidade e dados</PageTitle>

      <div className="not-prose grid gap-4 sm:grid-cols-3 mb-6">
        {[
          ["No seu navegador", "As respostas ficam só no seu dispositivo até você autorizar o envio.", "border-t-accent"],
          ["Sem identificação", "Nunca pedimos nome, email, documento, endereço ou IP.", "border-t-purple"],
          ["Você pode recusar", "A recusa não impede o questionário e pode ser feita a qualquer momento.", "border-t-mint"],
        ].map(([title, text, tone], i) => (
          <section key={title} className={`card animate-fade-up p-5 border-t-4 shadow-sm ${tone}`} style={{ animationDelay: `${100 + i * 90}ms` }}>
            <h2 className="font-semibold text-base">{title}</h2>
            <p className="mt-1.5 text-sm text-ink-2 leading-relaxed">{text}</p>
          </section>
        ))}
      </div>

      <h2>Onde ficam as suas respostas</h2>
      <p>No seu navegador. As respostas do questionário são guardadas apenas no armazenamento local do seu dispositivo e usadas para montar o seu relatório. Nada é enviado ao servidor sem o seu consentimento explícito.</p>

      <h2>O que coletamos, se você autorizar</h2>
      <ul>
        <li>As alternativas marcadas em cada pergunta.</li>
        <li>A importância que você deu a cada tema.</li>
        <li>Opcionalmente, faixa etária e região do Brasil, em categorias amplas.</li>
        <li>A versão da metodologia e a data do envio.</li>
        <li>Se você quiser, uma avaliação anônima da pesquisa (nota de 1 a 5 e se ela ajudou na sua decisão).</li>
      </ul>

      <h2>O que não coletamos</h2>
      <ul>
        <li>Nome, email, telefone, CPF, documento, endereço, CEP, cidade, conta em rede social ou data de nascimento exata.</li>
        <li>Endereço IP ou user agent em campo de aplicação.</li>
        <li>Fingerprint do navegador, cookies de publicidade ou dados de outras páginas.</li>
        <li>Sexo, raça, religião ou renda. Esses campos não existem no formulário.</li>
      </ul>

      <h2>Por que coletamos</h2>
      <p>Somente para estatísticas agregadas: quantas pessoas responderam cada pergunta, percentual por alternativa, distribuição de prioridades, quantidade de respostas “não sei” e evolução ao longo do tempo. Os dados não são usados para propaganda personalizada nem para recomendação política individual.</p>
      <p className="text-sm">{STATISTICS_DISCLAIMER}</p>

      <h2>Como agregamos</h2>
      <p>Recortes com menos de {MIN_AGGREGATE_GROUP_SIZE} respostas não são exibidos. O painel de estatísticas é privado, mostra apenas agregações e nunca registros individuais. Percentuais são sempre “% das respostas”, nunca “% dos brasileiros”.</p>

      <h2>Por quanto tempo mantemos</h2>
      <p>Os envios anônimos são mantidos enquanto a pesquisa estiver ativa e, depois, apenas em forma agregada. Se a infraestrutura de hospedagem gerar logs técnicos com IP automaticamente, eles ficam fora da aplicação e devem ter a menor retenção possível; isso está documentado no README do projeto.</p>

      <h2>Quais tecnologias usamos</h2>
      <p>Armazenamento local do navegador (localStorage) para as suas respostas; um banco de dados PostgreSQL para os envios anônimos; nenhum serviço de analytics de terceiros.</p>

      <h2>Como recusar ou revogar</h2>
      <p>A recusa não impede o uso do questionário. Você pode recusar na tela de consentimento ou revogar aqui para respostas futuras:</p>
      <RevokeConsent />
    </div>
  );
}
