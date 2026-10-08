import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Metodologia" };

/** Texto da metodologia, revisado pela responsável pelo projeto (07/10/2026). Editar só com nova revisão. */
export default function MetodologiaPage() {
  return (
    <div className="container-page py-7 md:py-16 max-w-3xl prose-vd">
      <PageTitle eyebrow="Metodologia" tone="accent">Como este site funciona</PageTitle>

      <h2 id="objetivo">Objetivo</h2>
      <p>O site ajuda você a comparar suas opiniões com as posições e ações documentadas dos candidatos.</p>
      <p>Você responde 25 perguntas sobre políticas públicas e informa quais temas são mais importantes para você.</p>
      <p>Depois, o site mostra onde suas respostas são iguais, parecidas ou diferentes das posições de cada candidato.</p>
      <p>O site não recomenda voto, não dá nota aos candidatos e não cria ranking.</p>
      <p><strong>Você decide. Nós organizamos as evidências.</strong></p>

      <h2 id="principios">Princípios</h2>
      <p>Os mesmos critérios são usados para todos os candidatos.</p>
      <p>Não usamos opiniões de familiares, partidos, aliados ou apoiadores como posição do candidato.</p>
      <p>Também diferenciamos claramente:</p>
      <ul>
        <li>O que o candidato promete</li>
        <li>O que ele afirma defender</li>
        <li>O que ele realmente fez</li>
        <li>O que já está em vigor</li>
        <li>O que ainda é apenas projeto ou proposta</li>
      </ul>

      <h2 id="perguntas">Perguntas</h2>
      <p>São 25 perguntas divididas em 5 seções, com 12 temas.</p>
      <p>Os nomes dos candidatos não aparecem durante o questionário.</p>
      <p>Todas as perguntas possuem a opção “Não sei”.</p>

      <h2 id="importancia">Importância dos temas</h2>
      <p>No início de cada seção, você informa o quanto aqueles temas importam para você:</p>
      <ul>
        <li>Não importa</li>
        <li>Importa pouco</li>
        <li>Importa</li>
        <li>Importa muito</li>
        <li>É uma das coisas mais importantes para mim</li>
      </ul>
      <p>Essa informação serve para organizar seu relatório.</p>
      <p>Ela não aumenta nem diminui a pontuação de nenhum candidato.</p>

      <h2 id="comparacao">Como suas respostas são comparadas</h2>
      <p>Para cada pergunta, o site compara sua resposta com a posição documentada de cada candidato.</p>
      <p>O resultado pode ser:</p>
      <ul>
        <li>Igual a você</li>
        <li>Parecido com você</li>
        <li>Diferente de você</li>
      </ul>
      <p>Se não houver uma posição documentada do candidato, o site informa isso claramente.</p>
      <p>Nesse caso, a pergunta conta como diferente.</p>
      <p>A mesma regra vale para todos.</p>

      <h2 id="temas">Quem ficou mais próximo em cada tema</h2>
      <p>Para cada tema, o site calcula quantas respostas ficaram iguais ou parecidas com as posições de cada candidato.</p>
      <p>Resposta igual vale 1 ponto.</p>
      <p>Resposta parecida vale meio ponto.</p>
      <p>Depois, o total é dividido pelo número de perguntas respondidas naquele tema.</p>
      <p>O candidato com maior resultado aparece como mais próximo naquele tema.</p>
      <p>Em caso de empate, nenhum candidato é indicado.</p>

      <h2 id="resultado">Resultado geral</h2>
      <p>O relatório mostra:</p>
      <ul>
        <li>Em quantos temas cada candidato ficou mais próximo</li>
        <li>A proporção de respostas iguais ou parecidas com cada candidato</li>
        <li>A comparação de cada pergunta</li>
        <li>As fontes usadas</li>
      </ul>
      <p>Isso não é uma nota eleitoral nem uma recomendação de voto.</p>
      <p>É apenas uma comparação entre suas respostas e documentos públicos.</p>

      <h2 id="fontes">Fontes</h2>
      <p>Sempre damos preferência a documentos oficiais.</p>
      <p>A ordem de prioridade é:</p>
      <ol>
        <li>Documento original</li>
        <li>Base pública responsável pelo documento</li>
        <li>Fonte oficial do candidato</li>
        <li>Órgãos e instituições técnicas</li>
        <li>Jornalismo profissional</li>
      </ol>
      <p>Entre as principais fontes estão:</p>
      <ul>
        <li>TSE</li>
        <li>Planalto</li>
        <li>Câmara dos Deputados</li>
        <li>Senado Federal</li>
        <li>Gov.br</li>
      </ul>
      <p>Quando existe um documento oficial, damos preferência a ele em vez de uma reportagem.</p>

      <h2 id="evidencias">Tipos de evidência</h2>
      <p>As informações podem ser classificadas como:</p>
      <ul>
        <li>Proposta, aquilo que o candidato pretende fazer</li>
        <li>Posição, aquilo que o candidato diz defender</li>
        <li>Atuação, aquilo que ele efetivamente fez, votou, apresentou, sancionou ou decidiu</li>
        <li>Resultado observado, dados registrados durante determinado período</li>
      </ul>
      <p>Um resultado ocorrido durante um governo não é automaticamente atribuído ao presidente como causa.</p>

      <h2 id="lacunas">Quando não há informação</h2>
      <p>Se não encontrarmos uma posição suficientemente documentada, o site informa:</p>
      <p>“Não se posicionou nas fontes oficiais.”</p>
      <p>Não tentamos descobrir a posição do candidato com base em ideologia, partido ou opinião de terceiros.</p>

      <h2 id="mudanca">Mudança de posição</h2>
      <p>Se um candidato mudou de posição ao longo do tempo, o site mostra a sequência dos acontecimentos.</p>
      <p>A posição mais recente é usada na comparação, mas as anteriores continuam disponíveis para consulta.</p>

      <h2 id="privacidade">Privacidade</h2>
      <p>Para participar da pesquisa, é necessário aceitar a Política de Privacidade e o uso anônimo das respostas para fins de pesquisa.</p>
      <p>Podem ser usados de forma anônima:</p>
      <ul>
        <li>Suas respostas</li>
        <li>O resultado da comparação</li>
        <li>Sua avaliação da pesquisa</li>
        <li>Sua resposta sobre a pesquisa ter ajudado na decisão</li>
      </ul>
      <p>Faixa etária e região são opcionais.</p>
      <p>Os dados enviados são anônimos e não são usados para identificar você.</p>

      <h2 id="historico">Transparência</h2>
      <p>Toda mudança importante na metodologia é registrada.</p>
      <p>Versões antigas continuam documentadas.</p>
      <p>A metodologia atual é a versão 1.3.0, vigente desde 7 de outubro de 2026.</p>

      <h2 id="resumo">Em resumo</h2>
      <p>São 25 perguntas.</p>
      <p>Os candidatos ficam ocultos durante o questionário.</p>
      <p>As posições são baseadas principalmente em fontes oficiais.</p>
      <p>Você pode abrir as fontes e conferir as informações.</p>
      <p>Não existe nota, ranking ou indicação de voto.</p>
      <p>Somente dados, fontes e comparação.</p>
    </div>
  );
}
