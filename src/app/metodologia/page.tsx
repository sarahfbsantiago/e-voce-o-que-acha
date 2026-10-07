import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";
import { getContentRepository } from "@/lib/repository";
import { POLITICAL_DATA_UPDATED_AT } from "@/data/methodology";
import { COMMON_EXCLUSION_CRITERIA, COMMON_INCLUSION_CRITERIA, COMMON_PERIOD } from "@/data/research-protocols";
import { SOURCE_SEARCH_ORDER } from "@/data/source-registry";
import { PRIORITY_LEVELS, EVIDENCE_CLASSIFICATION_LABELS, EVIDENCE_STRENGTH_LABELS, SOURCE_LEGEND_LABELS } from "@/domain/types";
import { MIN_AGGREGATE_GROUP_SIZE } from "@/domain/aggregates";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Metodologia" };

export default async function MetodologiaPage() {
  const repo = await getContentRepository();
  const [topics, questions, versions, protocols] = await Promise.all([
    repo.getTopics(),
    repo.getQuestions(),
    repo.getMethodologyVersions(),
    repo.getResearchProtocols(),
  ]);
  const current = versions.find((v) => v.effectiveUntil === null) ?? versions[versions.length - 1];
  const protocolByQ = new Map(protocols.map((p) => [p.questionId, p]));

  return (
    <div className="container-page py-7 md:py-16 max-w-4xl prose-vd">
      <PageTitle eyebrow="Como este site funciona por dentro" tone="accent" lead={`Versão ${current.version}, vigente desde ${formatDate(current.effectiveFrom)}. Dados políticos e legislativos atualizados em ${formatDate(POLITICAL_DATA_UPDATED_AT)}.`}>
        Metodologia
      </PageTitle>

      <nav aria-label="Seções" className="not-prose card p-4 text-sm flex flex-wrap gap-2 shadow-sm">
        {[
          ["#objetivo", "Objetivo"], ["#principios", "Princípios"], ["#perguntas", "Perguntas"], ["#fontes", "Fontes"], ["#hierarquia", "Hierarquia"],
          ["#selecao", "Seleção"], ["#lacunas", "Lacunas e mudanças"], ["#estatisticas", "Estatísticas e causalidade"], ["#revisao", "Revisão"], ["#historico", "Histórico"],
        ].map(([h, l]) => <a key={h} href={h} className="chip rounded-full border border-line bg-surface px-3 py-1 text-ink-2 hover:border-purple/50 hover:bg-purple-soft hover:text-purple-strong">{l}</a>)}
      </nav>

      <h2 id="objetivo">Objetivo</h2>
      <p>Permitir que qualquer pessoa responda perguntas sobre políticas públicas, declare os assuntos que considera importantes, veja lado a lado o que os candidatos oficialmente propõem, consulte o histórico documentado de cada um, abra a fonte original de qualquer afirmação e tire a própria conclusão.</p>
      <p><strong>O site não recomenda candidato, não monta ranking e não calcula “melhor candidato”.</strong> O relatório mostra, com a fórmula à vista, quanto as respostas da pessoa concordam com o que cada candidato documentou e em quantos temas cada um ficou mais perto. Isso é descrição de concordância com documentos, não nota nem recomendação.</p>

      <h2 id="principios">Princípios</h2>
      <ul>
        <li>Você decide. Nós organizamos as evidências.</li>
        <li>Os mesmos critérios de evidência são aplicados aos dois candidatos.</li>
        <li>Não procuramos apenas informações favoráveis ou desfavoráveis a qualquer candidato.</li>
        <li>Não atribuímos a um candidato posições de partido, familiares, aliados ou apoiadores.</li>
        <li>Separamos fato de interpretação, proposta de realização e projeto apresentado de política implementada.</li>
        <li>Mandatos diferentes exigem métricas diferentes: chefe do Executivo (políticas, sanções, vetos, decretos, orçamento, execução) e parlamentar (projetos, coautorias, relatorias, votos, emendas, comissões, fiscalização, pronunciamentos). Um parlamentar nunca é penalizado por não possuir competências executivas.</li>
        <li>Toda decisão metodológica é pública e versionada.</li>
      </ul>

      <h2 id="perguntas">Perguntas e opções de resposta</h2>
      <p>{questions.length} perguntas em linguagem simples, em {topics.length} sessões (temas). Toda pergunta tem a alternativa “Não sei”. Os nomes dos candidatos ficam ocultos durante as perguntas e nenhuma cor partidária é usada.</p>
      <h3>Escala interna</h3>
      <p>Para perguntas com alternativas em escala existe uma normalização interna (Concordo ou Sim = 2; Concordo em parte ou alternativa intermediária = 1; Discordo em parte = −1; Discordo ou Não = −2; “Não sei” fica fora de qualquer comparação). As alternativas são exibidas sempre da mais afirmativa para a mais negativa, com “Não sei” por último. A escala serve para organizar as respostas e gráficos do próprio usuário e para medir a distância entre a resposta da pessoa e a posição documentada do candidato em cada pergunta. <strong>Nunca</strong> é multiplicada pela importância dos temas.</p>
      <h3>Importância dos temas</h3>
      <p>Ao final de cada sessão o usuário responde “Quanto este tema importa para você?” escolhendo entre: {PRIORITY_LEVELS.map((l) => l.label).join("; ")}. Essa informação é usada exclusivamente para ordenar o relatório. Nunca ocorre “peso do tema × posição do candidato”.</p>
      <h3>Pizzas das áreas</h3>
      <p>Para leitura rápida, a pizza do relatório agrupa os 12 temas em cinco áreas: <strong>Economia e trabalho</strong> (economia e impostos; trabalho, emprego e jornada; infraestrutura, indústria e desenvolvimento); <strong>Social, saúde, educação e renda</strong> (saúde; educação, ciência e pesquisa; programas sociais, pobreza e desigualdade); <strong>Segurança</strong> (segurança pública e crime organizado; armas, drogas e apostas); <strong>Ambiente e tecnologia</strong> (meio ambiente e energia; tecnologia e autonomia do Brasil); <strong>Instituições e mundo</strong> (relações internacionais; direitos, democracia e instituições). Na pizza da pessoa, cada fatia soma a importância declarada para os temas da área. Nas pizzas dos candidatos, cada fatia é o que o candidato fez, classificado por área pelo objeto do ato: para Lula, as leis, decretos, medidas provisórias e programas conferidos nas fontes oficiais; para Flávio Bolsonaro, todas as proposições de sua autoria principal registradas nos Dados Abertos do Senado (projetos de lei, PECs, projetos de lei complementar e decretos legislativos). Promessas de programa não entram nessa pizza. Para quem foi chefe do Executivo os atos são leis e decretos; para o parlamentar são projetos de autoria, que não equivalem a leis aprovadas. A lista completa, com link para cada ato, está no perfil de cada candidato. As pizzas não entram em nenhum cálculo de proximidade.</p>
      <h3>Comparação por pergunta</h3>
      <p>Cada posição publicada de um candidato tem uma direção na mesma escala (apoia = 2, apoia em parte = 1, neutro = 0, opõe-se em parte = −1, opõe-se = −2). A distância entre a resposta da pessoa e a direção do candidato define o indicador: distância 0 é “igual a você”, distância 1 é “parecido com você”, distância 2 ou mais é “diferente de você”. Em perguntas sem escala (listas de prioridades), compara-se a alternativa marcada com a alternativa mais próxima da posição documentada: a mesma é “igual”, a vizinha é “parecida”, qualquer outra é “diferente”.</p>
      <h3>Silêncio do candidato</h3>
      <p>Quando o candidato não tem posição documentada numa pergunta que a pessoa respondeu, a pergunta conta como “diferente” para ele. A regra vale igualmente para os dois candidatos e existe para que abster-se nunca beneficie ninguém. O site <strong>nunca atribui</strong> uma posição a quem não a manifestou: o relatório mostra “não se posicionou nas fontes oficiais” e a etiqueta “conta como diferente”. Só quando nenhum candidato tem posição no tema o relatório mostra “evidência insuficiente”.</p>
      <h3>Proximidade por tema e “mais próximo do seu perfil”</h3>
      <p>Em cada tema, o score de um candidato é a soma de iguais (1 ponto) e parecidas (meio ponto), dividida pelo número de perguntas que a pessoa respondeu no tema, incluindo as que contam como diferentes por silêncio. O candidato com maior score fica “mais próximo” naquele tema; empate não indica ninguém. O bloco “Qual candidato está mais próximo do seu perfil” conta em quantos temas cada um ficou mais perto e mostra, por candidato, a proporção de concordância em todas as perguntas respondidas e a proporção de temas, sempre com a conta aberta. Não há peso pela importância que a pessoa deu ao tema, não há soma de indicadores em nota e não há ranking: são contagens e proporções que descrevem concordância com documentos publicados.</p>
      <h3>Como as posições dos candidatos são registradas</h3>
      <p>Para cada pergunta e cada candidato registramos uma direção, a alternativa mais próxima, um resumo e as evidências, cada uma com trecho literal, data, link e classificação (proposta, posição ou atuação). As fontes usadas são: o programa de governo de 2026 registrado no TSE (com página do PDF); leis, decretos e medidas provisórias no Portal da Legislação do Planalto; projetos de autoria nos Dados Abertos do Senado; proposições, autoria e votações nos Dados Abertos da Câmara; e páginas oficiais de programas no gov.br. Declarações registradas pela imprensa profissional (nível C) entram apenas como declaração, com a frase entre aspas e a etiqueta de fonte jornalística, e nunca definem sozinhas a direção de uma posição. Quando nenhum documento trata do assunto, não registramos posição: o relatório mostra “não se posicionou nas fontes oficiais” e a pergunta conta como diferente. Quando a posição mudou ao longo do tempo (por exemplo, apostas: regulamentação em 2023, proibição por medida provisória em setembro de 2026), a evidência mais recente prevalece e o relatório mostra a linha do tempo. A explicação de cada pergunta cita primeiro o que foi feito (lei, decreto, projeto), depois o que foi prometido.</p>
      <p>Toda posição passa por revisão humana antes de publicação, em uma tela de administração onde cada item pode ser publicado, rejeitado ou despublicado, com registro de auditoria. Reimportações nunca sobrescrevem o que já foi revisado.</p>
      <h3>Trajetória dos candidatos</h3>
      <p>Os perfis trazem experiência profissional, cargos públicos, linha do tempo, leis e projetos ligados ao candidato e um quadro de principais realizações, propostas e posições por tema. Cada item tem fonte oficial com trecho e link: biografia oficial do Planalto, perfil e Dados Abertos do Senado, registros de candidatura do TSE (incluindo ocupação e escolaridade declaradas), leis e decretos no Planalto. Autoria de projeto é apresentada como autoria, nunca como lei aprovada; propostas em discussão e medidas provisórias ficam separadas das políticas consolidadas.</p>
      {topics.map((t) => (
        <details key={t.id} className="not-prose card card-lift p-5 mb-3">
          <summary className="font-semibold">{t.name} <span className="text-ink-3 font-normal">({questions.filter((q) => q.topicId === t.id).length} perguntas)</span></summary>
          <ol className="mt-3 space-y-4 text-sm">
            {questions.filter((q) => q.topicId === t.id).map((q) => {
              const p = protocolByQ.get(q.id);
              return (
                <li key={q.id} className="border-t border-line pt-3">
                  <p className="font-medium">{q.id.toUpperCase()}{q.subtopic ? ` · ${q.subtopic}` : ""} — {q.text}</p>
                  <ul className="mt-1 list-disc pl-5 text-ink-2">{q.options.map((o) => <li key={o.id}>{o.label}</li>)}</ul>
                  {p ? (
                    <details className="mt-2">
                      <summary className="text-purple-strong font-medium">Protocolo de pesquisa desta questão</summary>
                      <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-ink-2">
                        <dt>Termos</dt><dd>{p.searchTerms.join(", ")}</dd>
                        <dt>Fontes</dt><dd>{p.sourceIds.join(", ")}</dd>
                        <dt>Período</dt><dd>{p.period}</dd>
                        <dt>Definido em</dt><dd>{formatDate(p.definedAt)}</dd>
                      </dl>
                    </details>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </details>
      ))}

      <h2 id="fontes">Estrutura das fontes</h2>
      <p>Cada fonte registra nome, instituição, URL, tipo, data de publicação, data de consulta, status de verificação do link e, quando houver, URL arquivada e hash. Ordem obrigatória de busca:</p>
      <ol>{SOURCE_SEARCH_ORDER.map((s) => <li key={s}>{s}</li>)}</ol>
      <p>Evitamos reportagem quando o documento original está disponível.</p>
      <h3>Legendas de fonte</h3>
      <ul>{Object.values(SOURCE_LEGEND_LABELS).map((l) => <li key={l.label}><strong>{l.label}:</strong> {l.meaning}</li>)}</ul>

      <h2 id="hierarquia">Hierarquia das evidências</h2>
      <ul>{Object.values(EVIDENCE_STRENGTH_LABELS).map((l) => <li key={l.label}><strong>{l.label}.</strong> {l.examples}</li>)}</ul>
      <p>Uma posição de candidato nunca é determinada exclusivamente a partir de uma fonte de nível D.</p>
      <h3>Classificações</h3>
      <ul>{Object.values(EVIDENCE_CLASSIFICATION_LABELS).map((l) => <li key={l.label}><strong>{l.label}:</strong> {l.meaning}</li>)}</ul>
      <p>As categorias nunca se misturam. Resultado observado nunca é apresentado como prova automática de causalidade.</p>

      <h2 id="selecao">Critérios de seleção (contra cherry picking)</h2>
      <p>Para cada questão são definidos previamente tema, subtema, termos de pesquisa, fontes, período, critérios de inclusão e de exclusão. O resultado da pesquisa não altera retroativamente os critérios. Período padrão: {COMMON_PERIOD}</p>
      <h3>Inclusão</h3>
      <ul>{COMMON_INCLUSION_CRITERIA.map((c) => <li key={c}>{c}</li>)}</ul>
      <h3>Exclusão</h3>
      <ul>{COMMON_EXCLUSION_CRITERIA.map((c) => <li key={c}>{c}</li>)}</ul>

      <h2 id="lacunas">Ausência de evidência e mudanças de posição</h2>
      <p>Quando não há evidência suficiente, o relatório mostra explicitamente “não se posicionou nas fontes oficiais” com a etiqueta “conta como diferente”, e a API pública devolve o estado de ausência com a mensagem “Não encontramos posição suficientemente documentada deste candidato sobre esta questão.” Não preenchemos lacunas com inferências ideológicas. Documentos conflitantes são apresentados como conflitantes.</p>
      <p>Quando o candidato mudou publicamente de posição, apresentamos a cronologia com a frase “O posicionamento documentado do candidato mudou ao longo do período analisado”, sem usar automaticamente palavras como mentira, hipocrisia ou contradição.</p>
      <p>Expressões genéricas (“soberania digital”, “autonomia estratégica”, “reindustrialização”, “transformação digital”) são classificadas como posição geral. Não concluímos automaticamente que o candidato defende medidas específicas sem evidência própria.</p>

      <h2 id="estatisticas">Estatísticas e causalidade</h2>
      <p>Indicadores sempre trazem pesquisa, período de referência, data de divulgação, unidade e metodologia. Indicadores observados durante um governo não são atribuídos causalmente ao presidente. Forma correta: “A taxa passou de X para Y durante o período. Durante esse período foram implementadas as políticas A, B e C.” Afirmações causais só aparecem com estudo correspondente citado.</p>
      <p>Estatísticas agregadas das respostas desta pesquisa refletem apenas quem respondeu voluntariamente. Recortes com menos de {MIN_AGGREGATE_GROUP_SIZE} respostas não são exibidos. Não calculamos intenção de voto nem extrapolamos para a população.</p>

      <h2 id="revisao">Revisão cega e publicação</h2>
      <p>A revisão é humana e acontece na tela de administração: cada posição, com suas evidências, pode ser publicada, rejeitada ou despublicada, e cada ação gera registro de auditoria. O modelo de dados prevê o fluxo DRAFT → PENDING_REVIEW → APPROVED → PUBLISHED (ou REJECTED) e a revisão cega por evidência (texto, fonte e tema sem o nome do candidato, com reassociação posterior). Nesta versão a revisão é feita posição a posição, com o candidato visível; registramos isso aqui como limitação. Nenhuma evidência não publicada aparece como fato na interface pública. Importações automáticas e classificações por IA nunca publicam sozinhas.</p>

      <h2 id="historico">Versionamento e histórico de alterações</h2>
      <p>Nenhuma modificação apaga versões anteriores.</p>
      {versions.map((v) => (
        <article key={v.id} className="not-prose card p-5 mb-3 border-l-4 border-l-mint">
          <h3 className="font-semibold">Versão {v.version} — {v.title}</h3>
          <p className="text-sm text-ink-2 mt-1">Vigente de {formatDate(v.effectiveFrom)} {v.effectiveUntil ? `até ${formatDate(v.effectiveUntil)}` : "(atual)"}.</p>
          <p className="text-sm mt-2">{v.description}</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-ink-2 space-y-1">{v.changeLog.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </article>
      ))}
    </div>
  );
}

export const dynamic = "force-dynamic";
