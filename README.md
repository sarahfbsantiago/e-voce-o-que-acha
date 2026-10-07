# Menos Pior

> **Somente dados. Fontes oficiais disponíveis para consulta. Use com moderação.**

**No ar:** https://menos-pior.up.railway.app

## Sobre o quiz

O **Menos Pior** é um questionário sobre políticas públicas para o segundo turno presidencial de 2026, entre **Lula** e **Flávio Bolsonaro**. A pessoa responde sem ver os nomes dos candidatos. No fim, o relatório mostra com quem as respostas mais concordam, tema a tema, com a fonte de cada afirmação e a conta aberta.

O site não recomenda voto, não monta ranking e não usa algoritmo secreto.

## Objetivos

- Ajudar cada pessoa a entender as próprias prioridades e compará-las com o que os candidatos propõem e fizeram.
- Mostrar só informação verificável, com link para o documento original.
- Aplicar os mesmos critérios aos dois candidatos.
- Deixar a decisão com a pessoa: nada vira nota, recomendação ou intenção de voto.

## Metodologia

- **Neutralidade na coleta.** Nomes e cores partidárias ficam ocultos durante as perguntas. As alternativas aparecem da mais afirmativa para a mais negativa, com "Não sei" por último.
- **Posições documentadas.** Cada candidato tem uma posição por pergunta, com trecho literal, data, link e classificação: proposta, posição ou atuação.
- **Fatos antes de promessas.** A explicação de cada pergunta cita primeiro o que foi feito (lei, decreto, projeto) e depois o que foi prometido.
- **Mudança de posição.** Vale a evidência mais recente, e o relatório mostra a linha do tempo.
- **Cargo considerado.** Um parlamentar é avaliado pelo que um parlamentar faz; nunca é penalizado por não ter poderes de presidente.
- **Revisão humana.** Nenhuma posição aparece no site sem ser publicada no painel de administração (`/admin/posicoes`), com registro de auditoria.
- **Versões públicas.** Metodologia na versão 1.3.0, com histórico completo em `/metodologia` e em `src/data/methodology.ts`.
- **Privacidade.** Para participar, a pessoa concorda com o uso anônimo dos dados em nível de pesquisa (aceite no modelo da LGPD): respostas, resultado do relatório, nota da pesquisa e se ela ajudou na decisão. Faixa etária e região são opcionais. Nada de nome, email, documento ou IP.

## Perguntas

São 52 perguntas em 12 temas, todas com a opção "Não sei". Ao fim de cada tema, a pessoa diz quanto ele importa para ela.

| Tema | Perguntas |
|---|---|
| Economia e impostos | 4 |
| Trabalho, emprego e jornada | 4 |
| Saúde | 4 |
| Educação, ciência e pesquisa | 4 |
| Programas sociais, pobreza e desigualdade | 4 |
| Segurança pública e crime organizado | 4 |
| Armas, drogas e apostas | 5 |
| Meio ambiente e energia | 4 |
| Infraestrutura, indústria e desenvolvimento | 4 |
| Tecnologia e autonomia do Brasil | 5 |
| Relações internacionais | 5 |
| Direitos, democracia e instituições | 5 |

No relatório, os 12 temas aparecem em cinco áreas: **Economia e trabalho**; **Social, saúde, educação e renda**; **Segurança**; **Ambiente e tecnologia**; **Instituições e mundo**.

Abaixo estão todas as perguntas, na ordem em que aparecem, com as alternativas e o valor de cada uma na escala. A fonte é `src/data/questions.ts`, e a mesma lista aparece na página `/metodologia`.

<details>
<summary><strong>Ver as 52 perguntas e alternativas</strong></summary>

<!-- perguntas:inicio (gerado por npm run docs:questions; não edite à mão) -->

Escala de importância, perguntada ao fim de cada tema: Não importa (0) · Importa pouco (1) · Importa (2) · Importa muito (3) · É uma das coisas mais importantes para mim (4). Ela só ordena o relatório e nunca altera pesos.

Como ler as tabelas:

- **Escala** é o valor da alternativa na etapa 1 do algoritmo. "—" indica alternativa sem escala, comparada pela posição na lista.
- **Peso Lula** e **Peso Flávio Bolsonaro** é quanto a alternativa soma no numerador do score do tema para aquele candidato: 1 = igual, 0,5 = parecida, 0 = diferente ou candidato sem posição publicada. Toda pergunta respondida conta 1 no denominador.
- "Não sei" fica fora da conta: não soma no numerador nem no denominador.
- Os pesos refletem as posições publicadas em 07/10/2026 (104 posições). Quando uma posição é revisada, os pesos mudam e esta lista é regenerada.

### 1. Economia e impostos

_Impostos, contas públicas e apoio a empresas consideradas importantes._

**1. Quem ganha muito dinheiro deveria pagar uma porcentagem maior de imposto?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: opõe-se em parte (−1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Concordo | +2 | 1 | 0 |
| Concordo em parte | +1 | 0,5 | 0 |
| Discordo em parte | -1 | 0 | 1 |
| Discordo | -2 | 0 | 0,5 |
| Não sei | fora da conta | fora | fora |

**2. Pessoas que ganham menos deveriam pagar menos Imposto de Renda?**

> Contexto exibido antes: Situação atual: Imposto de Renda em 2026.

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0 |
| Sim, mas só para quem ganha pouco | +1 | 0,5 | 0 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**3. Quando o governo precisa economizar dinheiro, o que deveria proteger primeiro?**

- Posição documentada de Lula: alternativa mais próxima: “Tentar equilibrar os dois”
- Posição documentada de Flávio Bolsonaro: alternativa mais próxima: “As contas públicas e a dívida”

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Saúde, educação e programas sociais | — | 0 | 0,5 |
| As contas públicas e a dívida | — | 0,5 | 1 |
| Tentar equilibrar os dois | — | 1 | 0,5 |
| Não sei | fora da conta | fora | fora |

**4. O governo deveria ajudar empresas brasileiras consideradas importantes para o país?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim, com investimentos e crédito | +2 | 1 | 0,5 |
| Sim, mas só em alguns setores | +1 | 0,5 | 1 |
| Não, empresas deveriam competir sem ajuda | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**Quanto Economia e Impostos importam para você na escolha de um candidato?** Não importa · Importa pouco · Importa · Importa muito · É uma das coisas mais importantes para mim

### 2. Trabalho, emprego e jornada

_Jornada semanal, escala 6x1, trabalhadores de aplicativos e salário mínimo._

**5. Você é a favor de trabalhar 5 dias e folgar 2 por semana, sem redução do salário?**

> Contexto exibido antes: Situação atual: jornada de trabalho.

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Depende da profissão | +1 | 0,5 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**6. A escala em que a pessoa trabalha seis dias e folga um deveria continuar existindo?**

- Posição documentada de Lula: opõe-se (−2)
- Posição documentada de Flávio Bolsonaro: apoia (+2)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Não deveria continuar | -2 | 1 | 0 |
| Deveria existir apenas em alguns trabalhos | 0 | 0 | 0 |
| Deveria continuar como hoje | +2 | 0 | 1 |
| Não sei | fora da conta | fora | fora |

**7. Motoristas e entregadores de aplicativos deveriam ter direitos como aposentadoria, férias ou proteção em caso de acidente?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0 |
| Alguns direitos | +1 | 0,5 | 0 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**8. O salário mínimo deveria aumentar acima da inflação quando a economia estiver crescendo?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0 |
| Depende da situação econômica | +1 | 0,5 | 0 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**Quanto Trabalho e Jornada importam para você?** Não importa · Importa pouco · Importa · Importa muito · É uma das coisas mais importantes para mim

### 3. Saúde

_SUS, gasto público em saúde, parcerias e produção nacional de insumos._

**9. O SUS deveria continuar atendendo qualquer pessoa gratuitamente?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Sim, mas deveria mudar algumas regras | +1 | 0,5 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**10. O governo deveria gastar mais dinheiro com saúde pública?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0 |
| Sim, mas apenas se reduzir gastos em outras áreas | +1 | 0,5 | 0 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**11. Na saúde, o que deveria ser prioridade?**

- Posição documentada de Lula: alternativa mais próxima: “Fortalecer o SUS e fazer parcerias com empresas”
- Posição documentada de Flávio Bolsonaro: alternativa mais próxima: “Fortalecer o SUS e fazer parcerias com empresas”

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Fortalecer principalmente o SUS | — | 0,5 | 0,5 |
| Fortalecer o SUS e fazer parcerias com empresas | — | 1 | 1 |
| Aumentar a participação de empresas privadas | — | 0,5 | 0,5 |
| Não sei | fora da conta | fora | fora |

**12. O Brasil deveria produzir mais remédios, vacinas e equipamentos de saúde dentro do próprio país?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Apenas os produtos mais importantes | +1 | 0,5 | 1 |
| Não, importar pode ser melhor | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**Quanto Saúde importa para você?** Não importa · Importa pouco · Importa · Importa muito · É uma das coisas mais importantes para mim

### 4. Educação, ciência e pesquisa

_Rede federal, apoio a estudantes, pesquisa científica e prioridade entre etapas._

**13. O governo deveria criar mais universidades e institutos federais?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0 |
| Somente onde houver necessidade | +1 | 0,5 | 0 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**14. O governo deveria ajudar estudantes de baixa renda a pagar faculdade particular?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Sim, mas com regras mais rígidas | +1 | 0,5 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**15. O Brasil deveria investir mais dinheiro em pesquisas científicas?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Somente em pesquisas que tragam resultados mais rápidos | +1 | 0,5 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**16. Qual área deveria receber mais dinheiro primeiro?**

- Posição documentada de Lula: alternativa mais próxima: “Educação infantil e ensino fundamental”
- Posição documentada de Flávio Bolsonaro: alternativa mais próxima: “Ensino técnico”

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Educação infantil e ensino fundamental | — | 1 | 0 |
| Ensino médio | — | 0,5 | 0,5 |
| Ensino técnico | — | 0 | 1 |
| Universidades | — | 0 | 0,5 |
| Todas são igualmente importantes | — | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**Quanto Educação, Ciência e Pesquisa importam para você?** Não importa · Importa pouco · Importa · Importa muito · É uma das coisas mais importantes para mim

### 5. Programas sociais, pobreza e desigualdade

_Transferência de renda, condicionalidades, financiamento e prioridades contra a pobreza._

**17. O governo deveria manter programas que dão dinheiro para famílias de baixa renda?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Sim, mas com mais regras | +1 | 0,5 | 1 |
| Deveriam ser reduzidos | -1 | 0 | 0 |
| Não deveriam existir | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**18. Para receber alguns benefícios, famílias deveriam manter as crianças na escola e fazer acompanhamento de saúde?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0 |
| Depende do benefício | +1 | 0,5 | 0 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**19. O governo deveria cobrar mais impostos de pessoas muito ricas?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: opõe-se em parte (−1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0 |
| Em alguns casos | +1 | 0,5 | 0 |
| Não | -2 | 0 | 0,5 |
| Não sei | fora da conta | fora | fora |

**20. Para combater a pobreza, qual deveria ser a maior prioridade?**

- Posição documentada de Lula: alternativa mais próxima: “Usar todas essas medidas”
- Posição documentada de Flávio Bolsonaro: alternativa mais próxima: “Criar empregos”

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Dar auxílio financeiro | — | 0 | 0,5 |
| Criar empregos | — | 0 | 1 |
| Aumentar salários | — | 0 | 0,5 |
| Investir em educação | — | 0,5 | 0 |
| Usar todas essas medidas | — | 1 | 0 |
| Não sei | fora da conta | fora | fora |

**Quanto Programas Sociais e Combate à Pobreza importam para você?** Não importa · Importa pouco · Importa · Importa muito · É uma das coisas mais importantes para mim

### 6. Segurança pública e crime organizado

_Papel federal em crimes interestaduais, recursos da Polícia Federal, prevenção, punição e penas._

**21. Em crimes graves que envolvem vários estados, como grandes facções, tráfico de drogas, armas e lavagem de dinheiro, o governo federal e a Polícia Federal deveriam atuar mais, ajudando e coordenando as polícias estaduais?**

> Contexto exibido antes: Como a segurança pública se divide entre União e estados.

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia (+2)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Concordo | +2 | 1 | 1 |
| Concordo em parte | +1 | 0,5 | 0,5 |
| Discordo em parte | -1 | 0 | 0 |
| Discordo | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**22. A Polícia Federal deveria ter mais recursos para combater facções, corrupção, tráfico e crimes que acontecem em vários estados?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Sim, mas apenas em crimes mais graves | +1 | 0,5 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**23. O que ajuda mais a reduzir a violência?**

- Posição documentada de Lula: alternativa mais próxima: “As duas coisas juntas”
- Posição documentada de Flávio Bolsonaro: alternativa mais próxima: “Mais polícia e punição”

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Mais polícia e punição | — | 0 | 1 |
| Mais prevenção, educação e oportunidades | — | 0,5 | 0,5 |
| As duas coisas juntas | — | 1 | 0 |
| Não sei | fora da conta | fora | fora |

**24. Crimes violentos deveriam ter penas maiores?**

- Posição documentada de Lula: apoia em parte (+1)
- Posição documentada de Flávio Bolsonaro: apoia (+2)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 0,5 | 1 |
| Depende do crime | +1 | 1 | 0,5 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**Quanto Segurança Pública importa para você?** Não importa · Importa pouco · Importa · Importa muito · É uma das coisas mais importantes para mim

### 7. Armas, drogas e apostas

_Acesso a armas, regime de CACs, política de drogas e apostas online._

**25. Comprar e ter armas deveria ser:**

- Posição documentada de Lula: neutro (0)
- Posição documentada de Flávio Bolsonaro: apoia (+2)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Mais difícil | -2 | 0 | 0 |
| Como é hoje | 0 | 1 | 0 |
| Mais fácil | +2 | 0 | 1 |
| Não sei | fora da conta | fora | fora |

**26. Pessoas registradas como colecionadores, atiradores e caçadores deveriam ter regras diferentes para comprar armas?**

- Posição documentada de Lula: apoia em parte (+1)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 0,5 | 0,5 |
| Somente em alguns casos | +1 | 1 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**27. Qual deveria ser a principal forma de lidar com drogas?**

- Posição documentada de Lula: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)
- Posição documentada de Flávio Bolsonaro: alternativa mais próxima: “Mais repressão policial”

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Mais repressão policial | — | 0 | 1 |
| Mais tratamento de saúde | — | 0 | 0,5 |
| Mais prevenção e educação | — | 0 | 0 |
| Uma combinação dessas medidas | — | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**28. O que deveria acontecer com bets e apostas online?**

> Contexto exibido antes: Situação atual: apostas de quota fixa em 2026.

- Posição documentada de Lula: alternativa mais próxima: “Deveriam ser proibidas”
- Posição documentada de Flávio Bolsonaro: alternativa mais próxima: “Deveriam existir com regras semelhantes às de outros negócios”

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Deveriam ser proibidas | — | 1 | 0 |
| Deveriam existir com regras muito rígidas | — | 0,5 | 0,5 |
| Deveriam existir com regras semelhantes às de outros negócios | — | 0 | 1 |
| Deveriam ter poucas restrições | — | 0 | 0,5 |
| Não sei | fora da conta | fora | fora |

**29. Propagandas de bets deveriam ser permitidas?**

- Posição documentada de Lula: alternativa mais próxima: “Não”
- Posição documentada de Flávio Bolsonaro: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Não | — | 1 | 0 |
| Sim, mas com regras muito rígidas | — | 0,5 | 0 |
| Sim, com avisos e limites | — | 0 | 0 |
| Sim, sem grandes restrições | — | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**Quanto Armas, Drogas e Apostas importam para você?** Não importa · Importa pouco · Importa · Importa muito · É uma das coisas mais importantes para mim

### 8. Meio ambiente e energia

_Proteção de áreas sensíveis, desmatamento, metas climáticas e fontes de energia._

**30. O governo deveria impedir obras ou negócios quando houver grande risco de destruir uma área ambiental importante?**

- Posição documentada de Lula: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 0 | 0,5 |
| Depende do tamanho do risco | +1 | 0 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**31. Reduzir o desmatamento da Amazônia deveria ser uma prioridade do governo?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia (+2)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 1 |
| É importante, mas não deveria ser prioridade | +1 | 0,5 | 0,5 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**32. O Brasil deveria ter metas para reduzir a poluição que contribui para mudanças no clima?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Sim, mas sem prejudicar demais a economia | +1 | 0,5 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**33. Qual fonte de energia deveria receber mais investimentos?**

- Posição documentada de Lula: alternativa mais próxima: “Todas de forma equilibrada”
- Posição documentada de Flávio Bolsonaro: alternativa mais próxima: “Petróleo e gás”

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Solar e eólica | — | 0 | 0,5 |
| Petróleo e gás | — | 0 | 1 |
| Energia nuclear | — | 0,5 | 0,5 |
| Todas de forma equilibrada | — | 1 | 0 |
| Não sei | fora da conta | fora | fora |

**Quanto Meio Ambiente e Energia importam para você?** Não importa · Importa pouco · Importa · Importa muito · É uma das coisas mais importantes para mim

### 9. Infraestrutura, indústria e desenvolvimento

_Apoio à indústria, produção nacional, obras e preferência a produtos brasileiros._

**34. O governo deveria ajudar a indústria brasileira a crescer?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim, bastante | +2 | 1 | 0,5 |
| Sim, em setores importantes | +1 | 0,5 | 1 |
| Não, empresas deveriam competir sem ajuda | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**35. O Brasil deveria produzir dentro do país alguns produtos importantes?**

> Contexto exibido antes: Exemplos apenas como contexto.

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Somente produtos essenciais | +1 | 0,5 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**36. O governo deveria investir mais em estradas, transporte público, saneamento e habitação?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Sim, mas sem aumentar muito os gastos | +1 | 0,5 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**37. Quando preço e qualidade forem parecidos, o governo deveria dar preferência a produtos feitos no Brasil?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0 |
| Somente em áreas importantes | +1 | 0,5 | 0 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**Quanto Infraestrutura e Indústria importam para você?** Não importa · Importa pouco · Importa · Importa muito · É uma das coisas mais importantes para mim

### 10. Tecnologia e autonomia do Brasil

_Dependência tecnológica, inteligência artificial, proteção de dados, tecnologias próprias e fornecedores._

**38. O Brasil deveria depender menos de outros países para tecnologias importantes?**

> Contexto exibido antes: O que significa autonomia tecnológica.

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Somente em algumas tecnologias | +1 | 0,5 | 1 |
| Não é necessário | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**39. O governo deveria investir no desenvolvimento de inteligência artificial brasileira?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: opõe-se em parte (−1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0 |
| Somente em universidades e pesquisa | +1 | 0,5 | 0 |
| Deveria deixar principalmente para empresas privadas | -1 | 0 | 1 |
| Não deveria investir | -2 | 0 | 0,5 |
| Não sei | fora da conta | fora | fora |

**40. Informações importantes do governo e dos cidadãos deveriam ter regras especiais para ficarem protegidas no Brasil?**

> Contexto exibido antes: Termos usados nesta pergunta.

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Somente informações muito sensíveis | +1 | 0,5 | 1 |
| Não é necessário | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**41. O Brasil deveria investir em chips, satélites, internet e outras tecnologias próprias, mesmo que isso custe mais no começo?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Somente nas áreas mais importantes | +1 | 0,5 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**42. Sistemas importantes do governo deveriam evitar depender de uma única empresa estrangeira?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0 |
| Somente sistemas muito importantes | +1 | 0,5 | 0 |
| Não é necessário | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**Quanto Tecnologia e Autonomia Nacional importam para você?** Não importa · Importa pouco · Importa · Importa muito · É uma das coisas mais importantes para mim

### 11. Relações internacionais

_Relações com outros governos, disputas entre potências, Mercosul, BRICS, ONU, acordos e independência._

**43. O Brasil deveria manter boas relações com países mesmo quando discordar de seus governos?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Depende do país | +1 | 0,5 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**44. Quando Estados Unidos, China ou outras grandes potências entram em disputa, o Brasil deveria:**

- Posição documentada de Lula: alternativa mais próxima: “Tomar sua própria decisão em cada caso”
- Posição documentada de Flávio Bolsonaro: alternativa mais próxima: “Ficar mais próximo dos Estados Unidos e da Europa”

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Tomar sua própria decisão em cada caso | — | 1 | 0,5 |
| Ficar mais próximo dos Estados Unidos e da Europa | — | 0,5 | 1 |
| Ficar mais próximo da China e de países emergentes | — | 0 | 0,5 |
| Evitar tomar lado sempre que possível | — | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**45. O Brasil deveria fortalecer sua participação em grupos como Mercosul, BRICS e ONU?**

> Contexto exibido antes: ONU, Mercosul e BRICS não são instituições equivalentes.

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Em alguns deles | +1 | 0,5 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**46. Ao fazer acordos com outros países, o Brasil deveria priorizar:**

- Posição documentada de Lula: alternativa mais próxima: “Equilibrar as duas coisas”
- Posição documentada de Flávio Bolsonaro: alternativa mais próxima: “Comprar e vender com mais liberdade”

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Comprar e vender com mais liberdade | — | 0 | 1 |
| Proteger empresas e empregos brasileiros | — | 0,5 | 0,5 |
| Equilibrar as duas coisas | — | 1 | 0 |
| Não sei | fora da conta | fora | fora |

**47. O Brasil deveria buscar mais independência nas decisões internacionais, mesmo quando isso desagradar países mais poderosos?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Depende da situação | +1 | 0,5 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**Quanto Relações Internacionais importam para você?** Não importa · Importa pouco · Importa · Importa muito · É uma das coisas mais importantes para mim

### 12. Direitos, democracia e instituições

_Direitos civis, religião e Estado, decisões do STF, independência dos órgãos de controle e corrupção._

**48. Casais do mesmo sexo deveriam ter os mesmos direitos dos outros casais?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0 |
| Alguns direitos | +1 | 0,5 | 0 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**49. Religiões deveriam influenciar as decisões do governo?**

- Posição documentada de Lula: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)
- Posição documentada de Flávio Bolsonaro: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Não | -2 | 0 | 0 |
| Podem participar do debate, mas não decidir políticas | 0 | 0 | 0 |
| Sim, deveriam ter mais influência | +2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**50. Quando o STF toma uma decisão válida, governo e Congresso devem cumprir essa decisão mesmo discordando dela?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Depende do caso | +1 | 0,5 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**51. Órgãos como Polícia Federal, Ministério Público e tribunais de contas deveriam poder investigar pessoas do próprio governo sem interferência política?**

- Posição documentada de Lula: apoia (+2)
- Posição documentada de Flávio Bolsonaro: apoia em parte (+1)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Sim | +2 | 1 | 0,5 |
| Sim, mas com mais controle sobre essas instituições | +1 | 0,5 | 1 |
| Não | -2 | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**52. Quando existem suspeitas de corrupção envolvendo políticos, qual deveria ser a regra?**

- Posição documentada de Lula: alternativa mais próxima: “Investigar independentemente do partido”
- Posição documentada de Flávio Bolsonaro: posição publicada como pouco clara, tratada como silêncio (0 em todas as alternativas)

| Alternativa | Escala | Peso Lula | Peso Flávio Bolsonaro |
|---|---|---|---|
| Investigar independentemente do partido | — | 1 | 0 |
| Investigar, mas com regras mais rígidas para evitar abusos | — | 0,5 | 0 |
| Somente investigar quando houver provas fortes desde o início | — | 0 | 0 |
| Não sei | fora da conta | fora | fora |

**Quanto Direitos, Democracia e Instituições importam para você?** Não importa · Importa pouco · Importa · Importa muito · É uma das coisas mais importantes para mim

<!-- perguntas:fim -->

</details>

## Algoritmo matemático

Toda a conta é pública, determinística e reproduzível: as mesmas respostas e as mesmas posições publicadas sempre geram o mesmo resultado. Não há pesos escondidos, aprendizado de máquina nem ajuste manual. O código fica em `src/domain/`, e cada regra abaixo tem teste em `tests/domain/`.

| Etapa | Arquivo | Teste |
|---|---|---|
| 1. Escala comum | `src/data/questions.ts`, `src/domain/comparison.ts` | `comparison.test.ts` |
| 2. Comparação por pergunta | `src/domain/comparison.ts` | `comparison.test.ts` |
| 3. Regra do silêncio e 4. Score por tema | `src/domain/theme-proximity.ts` | `theme-proximity.test.ts` |
| 5. Perfil geral | `src/domain/profile-proximity.ts` | `profile-proximity.test.ts` |
| 6. Ordem e tendência do próprio usuário | `src/domain/ordering.ts`, `src/domain/user-summary.ts` | `ordering.test.ts` |
| 7. Estatísticas anônimas | `src/domain/aggregates.ts`, `src/domain/profile-proximity.ts` | `aggregates.test.ts`, `profile-proximity.test.ts` |

### Notação

| Símbolo | Significado |
|---|---|
| `T` | um tema (sessão do questionário) |
| `Q(T)` | perguntas do tema `T` |
| `c` | um candidato |
| `u(q)` | valor da resposta do usuário na pergunta `q` |
| `p(c, q)` | valor da posição **publicada** do candidato `c` na pergunta `q` |
| `R(c, T)` | perguntas de `T` respondidas pelo usuário, sem "Não sei" |

### 1. Escala comum

Respostas e posições são convertidas para a mesma régua inteira de −2 a +2.

```
u(q) ∈ { −2, −1, 0, +1, +2 }
       Concordo / Sim = +2 · Concordo em parte / alternativa intermediária = +1
       Discordo em parte = −1 · Discordo / Não = −2

p(c, q) ∈ { −2, −1, 0, +1, +2 }
       apoia = +2 · apoia em parte = +1 · neutro = 0
       opõe-se em parte = −1 · opõe-se = −2
```

"Não sei" nunca entra em nenhuma conta: a pergunta simplesmente sai do denominador. Uma posição com direção "pouco clara" (`UNCLEAR`) é tratada como inexistente.

```ts
// src/domain/comparison.ts
const DIRECTION_VALUE: Record<Exclude<PositionDirection, "UNCLEAR">, number> = {
  SUPPORTS: 2,
  PARTIALLY_SUPPORTS: 1,
  NEUTRAL: 0,
  PARTIALLY_OPPOSES: -1,
  OPPOSES: -2,
};
```

### 2. Comparação por pergunta

Para cada pergunta e cada candidato, o resultado é uma de quatro categorias, calculada pela distância absoluta na escala.

```
d(c, q) = | u(q) − p(c, q) |

d = 0      → igual
d = 1      → parecido
d ≥ 2      → diferente
sem p(c,q) → evidência insuficiente (vira "diferente" na etapa 3)
```

Nas perguntas de escolha entre itens sem escala (por exemplo, "qual deveria ser a prioridade"), a posição publicada aponta a alternativa mais próxima da proposta do candidato. A comparação usa a ordem das alternativas: a mesma alternativa é igual, a vizinha imediata é parecida, qualquer outra é diferente. Em perguntas de múltipla escolha, vale a alternativa marcada mais próxima.

```ts
// src/domain/comparison.ts
export function compareAnswerToPosition(question, answer, position): ComparisonIndicator | null {
  if (!answer || answer.optionIds.length === 0) return null;

  const selected = question.options.filter((o) => answer.optionIds.includes(o.id));
  if (selected.length === 0) return null;
  if (selected.every((o) => o.isNoOpinion)) return null;           // "Não sei": fora da conta

  if (!position || position.reviewStatus !== "PUBLISHED" || position.direction === "UNCLEAR") {
    return "INSUFFICIENT_EVIDENCE";                                  // sem posição publicada
  }

  // Escala ordinal: distância absoluta
  const userValues = selected.map((o) => o.normalizedValue).filter((v): v is number => v !== null);
  if (question.kind === "AGREEMENT" || (userValues.length === selected.length && userValues.length > 0)) {
    const candidateValue = DIRECTION_VALUE[position.direction];
    const distance = Math.min(...userValues.map((v) => Math.abs(v - candidateValue)));
    if (distance === 0) return "SIMILAR";
    if (distance === 1) return "PARTIALLY_SIMILAR";
    return "DIFFERENT";
  }

  // Escolha entre itens: mesma alternativa ou vizinha
  if (!position.closestOptionId) return "INSUFFICIENT_EVIDENCE";
  const closest = question.options.find((o) => o.id === position.closestOptionId);
  if (!closest || closest.isNoOpinion) return "INSUFFICIENT_EVIDENCE";
  if (selected.some((o) => o.id === closest.id)) return "SIMILAR";
  const adjacent = selected.some((o) => !o.isNoOpinion && Math.abs(o.order - closest.order) === 1);
  return adjacent ? "PARTIALLY_SIMILAR" : "DIFFERENT";
}
```

Só posições com status `PUBLISHED` contam. Rascunhos, posições em revisão e posições rejeitadas são invisíveis para o algoritmo.

### 3. Regra do silêncio

Se o usuário respondeu uma pergunta e o candidato não tem posição publicada sobre ela, a pergunta conta como **diferente** para esse candidato. O site nunca inventa a posição, mostra "não se posicionou nas fontes oficiais" e explica a regra. O motivo é evitar que se abster de um tema melhore o resultado de alguém.

```
para cada q ∈ R(c, T):
    se existe p(c, q): conta em igual, parecido ou diferente conforme a etapa 2
    senão:             conta em silêncio, que entra no denominador e soma zero no numerador
```

### 4. Score por tema

Para cada tema `T` e cada candidato `c`:

```
iguais(c, T)    = nº de q ∈ R(c, T) com d = 0
parecidas(c, T) = nº de q ∈ R(c, T) com d = 1
n(c, T)         = documentadas + silêncios = | R(c, T) |

               iguais(c, T) + 0,5 × parecidas(c, T)
score(c, T) = ─────────────────────────────────────
                            n(c, T)

score(c, T) ∈ [0, 1]   (0 quando n = 0)
```

Regras de decisão no tema:

1. Se nenhum candidato tem ao menos uma posição publicada no tema, o resultado é **evidência insuficiente** e ninguém é indicado.
2. Se os dois scores forem exatamente iguais, o resultado é **empate** e ninguém é indicado.
3. Caso contrário, o tema indica o candidato de maior score como **maior proximidade documentada**, sempre com a contagem visível.

```ts
// src/domain/theme-proximity.ts
for (const q of questions) {
  const pos = positions.find((p) => p.candidateId === c.id && p.questionId === q.id) ?? null;
  const ind = compareAnswerToPosition(q, answerByQ.get(q.id), pos);
  if (ind === null) continue;                                          // sem resposta ou "Não sei"
  if (ind === "INSUFFICIENT_EVIDENCE") { count.silent += 1; continue; } // silêncio
  count.documented += 1;
  if (ind === "SIMILAR") count.similar += 1;
  else if (ind === "PARTIALLY_SIMILAR") count.partiallySimilar += 1;
  else count.different += 1;
}

if (!counts.some((c) => c.documented >= MIN_DOCUMENTED_PER_CANDIDATE))
  return { counts, closestCandidateId: null, reason: "INSUFFICIENT_EVIDENCE" };

const score = (c: CandidateThemeCount) => {
  const total = c.documented + c.silent;
  return total === 0 ? 0 : (c.similar + c.partiallySimilar / 2) / total;
};
const sorted = [...counts].sort((a, b) => score(b) - score(a));
if (sorted.length > 1 && score(sorted[0]) === score(sorted[1]))
  return { counts, closestCandidateId: null, reason: "TIE" };
return { counts, closestCandidateId: sorted[0].candidateId, reason: null };
```

### 5. Perfil geral

O perfil não soma scores nem tira média de temas. Ele conta **em quantos temas** cada candidato ficou mais perto, e mostra duas proporções para dar contexto.

```
temas(c)       = nº de temas T em que c foi indicado na etapa 4
comparáveis    = nº de temas em que algum candidato foi indicado

                      Σ_T iguais(c, T) + 0,5 × Σ_T parecidas(c, T)
concordância(c) = ──────────────────────────────────────────────── × 100 %
                               Σ_T n(c, T)

proporção de temas(c) = temas(c) ÷ comparáveis
```

Decisão do perfil:

1. Se `comparáveis = 0`, o resultado é **sem comparação**.
2. Se os dois candidatos têm o mesmo `temas(c)`, o resultado é **empate**.
3. Caso contrário, o perfil indica quem ficou mais perto em mais temas.

```ts
// src/domain/profile-proximity.ts
const themes = topicIds.map((t) =>
  themeProximity(questions.filter((q) => q.topicId === t), answers, candidates, positions));

// por candidato: themes = temas em que ficou mais perto
//                agreement = (similar + partiallySimilar / 2) / answered * 100

const decidedThemes = themes.filter((t) => t.closestCandidateId).length;
if (decidedThemes === 0) return { totals, decidedThemes, closestCandidateId: null, reason: "NO_COMPARISON" };
const sorted = [...totals].sort((a, b) => b.themes - a.themes);
if (sorted.length > 1 && sorted[0].themes === sorted[1].themes)
  return { totals, decidedThemes, closestCandidateId: null, reason: "TIE" };
return { totals, decidedThemes, closestCandidateId: sorted[0].candidateId, reason: null };
```

### Exemplo numérico completo

Tema com quatro perguntas. O usuário responde:

| Pergunta | Resposta | u(q) |
|---|---|---|
| q1 | Concordo | +2 |
| q2 | Sim | +2 |
| q3 | Discordo | −2 |
| q4 | Não sei | fora da conta |

Posições publicadas, com candidatos chamados A e B para não confundir com pessoas reais:

| Pergunta | Posição A | d(A) | Resultado A | Posição B | d(B) | Resultado B |
|---|---|---|---|---|---|---|
| q1 | apoia (+2) | 0 | igual | opõe-se (−2) | 4 | diferente |
| q2 | apoia em parte (+1) | 1 | parecido | apoia (+2) | 0 | igual |
| q3 | sem posição | — | silêncio = diferente | opõe-se (−2) | 0 | igual |
| q4 | qualquer | — | fora | qualquer | — | fora |

Cálculo:

```
score(A) = (1 igual + 0,5 × 1 parecida) ÷ 3 respondidas = 1,5 ÷ 3 = 0,50
score(B) = (2 iguais + 0,5 × 0)         ÷ 3 respondidas = 2,0 ÷ 3 = 0,67

0,67 > 0,50  →  maior proximidade documentada neste tema: B
```

Se A não tivesse silêncio em q3 e sim uma posição "opõe-se", A ficaria com (2 + 0,5) ÷ 3 = 0,83 e passaria a ser o mais próximo. Isso mostra o efeito da regra do silêncio: só posições documentadas podem aproximar um candidato do usuário.

No perfil, se depois dos 12 temas A ficou mais perto em 4, B em 6 e houve 2 empates, então `comparáveis = 10`, o perfil indica B e mostra "B ficou mais perto em 6 de 10 temas comparáveis".

### 6. O que fica fora da conta

**Importância dos temas.** A importância declarada (0 a 4) nunca multiplica, pondera ou soma nada. Ela só ordena o relatório e desenha a pizza de prioridades do usuário. Há um teste que varre o código em busca de qualquer `level * posição`.

```ts
// src/domain/ordering.ts: único uso da importância
export function sortTopicsByPriority(topics: Topic[], priorities: TopicPriority[]): Topic[] {
  const level = new Map(priorities.map((p) => [p.topicId, p.level as number]));
  return [...topics]
    .map((t, index) => ({ t, index, level: level.get(t.id) ?? -1 }))
    .sort((a, b) => (b.level !== a.level ? b.level - a.level : a.index - b.index))
    .map((x) => x.t);
}
```

**Tendência do próprio usuário.** O mapa de prioridades descreve como a pessoa respondeu, sem envolver candidatos: é a média dos valores da escala no tema, arredondada para duas casas.

```
tendência(T) = média de u(q) para q ∈ Q(T) respondidas, sem "Não sei"

≥ 1,5 concorda fortemente · ≥ 0,5 concorda · entre −0,5 e 0,5 neutro
≤ −0,5 discorda · ≤ −1,5 discorda fortemente
```

**Quantidade de proposições.** O perfil de cada candidato mostra os totais oficiais, que não entram no cálculo: o governo Lula apresentou 1.303 proposições na Câmara (455 projetos de lei) e Flávio Bolsonaro, 66 no Senado (53 projetos de lei). Detalhes em `docs/levantamentos/2026-10-07-proposicoes-poder-executivo-mandatos-lula.md`.

**Ordem dos candidatos na tela.** Sorteada uma vez por sessão (Fisher–Yates), para que nenhum candidato fique sempre à esquerda. Não afeta a conta.

### 7. Estatísticas anônimas

Só com consentimento. Cada questionário enviado passa pelas etapas 2 a 5 com as mesmas funções, e o painel privado mostra apenas agregados.

```
% de uma alternativa      = respostas com a alternativa ÷ respostas à pergunta × 100
% de perfil mais perto(c) = questionários com perfil = c ÷ questionários com comparação × 100
concordância média(c)     = média de concordância(c) entre questionários com ao menos uma pergunta comparável
```

Recortes demográficos com menos de 10 respostas (`MIN_AGGREGATE_GROUP_SIZE`) são suprimidos. Os percentuais são sempre "% das respostas desta pesquisa", nunca "% dos brasileiros", e não representam intenção de voto.

```ts
// src/domain/profile-proximity.ts
const outcomes = submissions.map((s) => profileProximity(questions, s.answers, candidates, positions));
const noComparison = outcomes.filter((o) => o.reason === "NO_COMPARISON").length;
const withComparison = outcomes.length - noComparison;
const count = outcomes.filter((o) => o.closestCandidateId === c.id).length;
const share = withComparison ? Math.round((count / withComparison) * 1000) / 10 : null;
```

### Como conferir

```bash
npm test -- tests/domain/comparison.test.ts tests/domain/theme-proximity.test.ts tests/domain/profile-proximity.test.ts
```

Qualquer mudança nestas fórmulas exige nova versão em `src/data/methodology.ts`. As versões anteriores ficam públicas em `/metodologia`.

## Fontes

63 fontes cadastradas, todas com link (`src/data/source-registry.ts`; catálogo pesquisável em `/fontes`).

- **Programas de governo de 2026** registrados no TSE, com a página do PDF de cada citação.
- **Portal da Legislação do Planalto:** leis, decretos e medidas provisórias.
- **Dados Abertos do Senado:** projetos de autoria, relatorias e votações.
- **Dados Abertos da Câmara dos Deputados:** proposições, autoria e votações.
- **Páginas oficiais do gov.br** sobre programas federais.
- **Biografia oficial do Planalto e registros de candidatura do TSE:** trajetória, ocupação e escolaridade.
- **Imprensa profissional:** só como declaração entre aspas e com link; nunca define sozinha a posição de um candidato.

---

## Para desenvolvedores

### Stack

Next.js 16 (App Router, Server Components, Route Handlers, Server Actions) · TypeScript · React 19 · Tailwind CSS 4 · PostgreSQL · Prisma 6 · Zod · Vitest. Fonte: Verdana (fonte do sistema, com Tahoma e DejaVu Sans como alternativas).

### Instalação

```bash
npm install            # roda `prisma generate` no postinstall
cp .env.example .env   # ajuste DATABASE_URL e ADMIN_TOKEN
npm run dev            # http://localhost:3000
```

#### Dois modos de execução

| Modo | Quando | O que funciona |
|------|--------|----------------|
| `static` | sem `DATABASE_URL` (ou `DATA_SOURCE=static`) | Todo o site e a API de conteúdo, lendo de `src/data`. Posições, evidências e resumos ficam vazios. Envio de estatísticas e painel admin respondem 503. |
| `prisma` | com `DATABASE_URL` | Conteúdo lido do banco (após seed), estatísticas anônimas, avaliação e painel admin. |

#### Banco de dados

```bash
docker compose up -d           # PostgreSQL 16 local
npm run db:migrate             # aplica prisma/migrations
npm run db:seed                # candidatos, temas, perguntas, fontes, protocolos, metodologia
```

O seed **não** insere posições de candidatos, evidências nem resumos de programa. Eles entram com `npm run db:import-drafts` como `DRAFT` e só aparecem no site depois de publicados em `/admin/posicoes` (ver *Rascunhos para revisão*).

#### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | não | Conexão PostgreSQL. Sem ela, modo estático. |
| `DATA_SOURCE` | não | Força `static` ou `prisma`. |
| `ADMIN_TOKEN` | não | Token (≥16 caracteres) dos painéis `/admin/research` (agregados) e `/admin/posicoes` (publicação de posições). Sem ele os painéis ficam desativados. |
| `NEXT_PUBLIC_SITE_URL` | não | URL pública (ex.: `https://menos-pior.up.railway.app`) usada nas tags de compartilhamento. |

#### Rascunhos para revisão (levantamentos)

```bash
npm run db:import-drafts   # importa prisma/drafts/*.json e docs/levantamentos/*.csv como DRAFT
```

`prisma/drafts/positions.draft.json` traz as 104 posições (52 perguntas × 2 candidatos) com suas
evidências, classificadas a partir dos programas de 2026 registrados no TSE e de leis, decretos,
medidas provisórias e projetos em fontes oficiais. `docs/levantamentos/` guarda a conferência de
fontes e trajetória, os resumos dos programas por tema e a lista de projetos de Flávio Bolsonaro
no Senado. Tudo entra no banco como `DRAFT` e **não aparece no site** até ser publicado em
`/admin/posicoes` (publicar, rejeitar, despublicar ou publicar tudo, sempre com `AuditLog`).
Com `IMPORT_UPDATE_PUBLISHED=1`, a reimportação atualiza posições já publicadas mantendo o status;
itens já revisados nunca são sobrescritos.

#### Testes e qualidade

```bash
npm test          # vitest: regras metodológicas e API
npm run typecheck
npm run lint
npm run build
```

### Arquitetura

```
prisma/
  schema.prisma            # modelos, enums, relações (sem campo de pontuação)
  migrations/              # SQL versionado
  seed.ts                  # seed sem posições de candidatos
src/
  app/                     # páginas (App Router) e API
    api/                   # GET públicos; POST anônimos; GET admin protegido
    questionario/          # intro + consentimento → perguntas → prioridades
    relatorio/             # "Seu mapa de prioridades" (sem pontuação)
    metodologia/ fontes/ como-funciona/
    admin/                 # login por token + painel agregado privado
  components/              # UI acessível, cards simétricos, legendas por forma+texto
  data/                    # CONTEÚDO CANÔNICO: temas, perguntas, notas de contexto,
                           # argumentos, SOURCE_REGISTRY, protocolos, metodologia
  domain/                  # regras: ordenação, indicador por questão, publicação,
                           # agregação, neutralidade, ordem aleatória de candidatos
  ingestion/               # SourceAdapter + adapters (Câmara, Senado, TSE) → DRAFT
  lib/                     # repositório (static|prisma), validação Zod, auth admin
  store/                   # sessão no navegador (localStorage)
tests/                     # domain/ e api/
```

#### Fluxo do usuário

Página inicial → Como funciona / Metodologia → Aceite obrigatório no modelo da LGPD, com idade e região opcionais → 52 perguntas em 12 sessões, uma por tela, sem nomes de candidatos → Importância de cada tema (ao final de cada sessão) → **Relatório**: pizza do seu perfil por área · **Qual candidato está mais próximo do seu perfil** (cinco áreas com os temas dentro; diálogo por pergunta com a alternativa de cada candidato, o documento, a data e o link; conta aberta) · como você respondeu por tema · trajetória de cada candidato (experiência, cargos, leis e projetos, quadro por área e tema, "Como sabemos disso?") · fontes usadas · avaliação anônima → mensagem final: "Este site não decide seu voto. A decisão é sua." → recomeçar do zero ou baixar em PDF.

#### Modelo de dados (resumo)

`Candidate`, `Topic`, `Question`, `QuestionOption`, `ContextNote`, `ArgumentSet`, `Source`, `Evidence`, `CandidatePosition` (→ N `Evidence` via `CandidatePositionEvidence`), `LegislativeAction`, `PublicPolicy`, `Indicator` (nunca é posição), `ProgramSummary`, `EvidenceReview` (revisão cega), `MethodologyVersion`, `ResearchProtocol`, `ChangeLog`, `AuditLog`, `RawDocument`, `LlmClassification`, `SurveySubmission`, `QuestionAggregate`, `SurveyFeedback`.

#### API

| Rota | Descrição |
|------|-----------|
| `GET /api/questions`, `GET /api/questions/[id]`, `GET /api/questions/[id]/evidence` | Perguntas, contexto, protocolo; evidências publicadas por candidato com estado explícito de ausência |
| `GET /api/topics` | Temas |
| `GET /api/candidates`, `GET /api/candidates/[id]`, `GET /api/candidates/[id]/positions` | Candidatos e posições publicadas por pergunta |
| `GET /api/sources`, `GET /api/sources/[id]` | Registro de fontes (filtros `institution`, `legend`, `type`) |
| `GET /api/methodology`, `GET /api/methodology/history` | Metodologia vigente (1.3.0) e todas as versões, inclusive a 1.0.0 |
| `GET /api/research/protocols?questionId=` | Protocolos de pesquisa |
| `POST /api/survey/submissions` | Envio anônimo (schema estrito; rejeita qualquer campo identificável) |
| `POST /api/survey/feedback` | Avaliação anônima da pesquisa |
| `GET /api/admin/research[?format=csv]` | Agregados privados (token) |

O painel `/admin/posicoes` (Server Actions, token) publica, rejeita, despublica e publica em lote, com `AuditLog`. O modelo prevê `DRAFT → PENDING_REVIEW → APPROVED → PUBLISHED | REJECTED`; só `PUBLISHED` aparece ao público. Hoje a revisão é posição a posição, com o candidato visível; a revisão cega por evidência (`EvidenceReview`) está no modelo e ainda não tem tela.

### Processo de inclusão de fontes e evidências

1. Consultar o `ResearchProtocol` da questão (termos, fontes, período, critérios) **antes** de pesquisar.
2. Localizar na ordem: documento original → base pública → fonte primária do candidato → organismo técnico → imprensa profissional.
3. Registrar a fonte em `Source` (URL, instituição, tipo, datas, verificação do link, hash/arquivo quando possível).
4. Criar `Evidence` como `DRAFT` com trecho original, classificação, força e critério.
5. Revisão humana em `/admin/posicoes` (posição a posição; a revisão cega por evidência, `EvidenceReview`, está no modelo e ainda não tem tela).
6. Publicar (`PUBLISHED`) só depois da revisão. Cada mudança gera `AuditLog`.
7. `CandidatePosition` só pode ser publicada com ≥1 evidência aprovada e não apenas de nível D (`src/domain/publication.ts`).
8. Mudança de posição → cronologia, sem palavras como "mentira" ou "contradição".
9. Ingestão automática (`src/ingestion`) e classificação por LLM **nunca** publicam: produzem `DRAFT` com prompt, modelo, versão, resposta e confiança registrados.

### Regras de neutralidade verificadas em código

`tests/domain/neutrality-scan.test.ts` varre `src/` em busca de frases e identificadores de ranking/recomendação. `src/domain/publication.ts` rejeita resumos com linguagem proibida. `src/domain/comparison.ts` exporta uma única função, por questão. `src/domain/aggregates.ts` não possui função de intenção de voto. A ordem esquerda/direita dos candidatos é sorteada por sessão e os cards têm o mesmo espaço visual.

### Privacidade e logs

A aplicação não lê IP nem user agent. Se a infraestrutura de hospedagem (proxy, CDN, provedor) gerar logs de acesso com IP, eles ficam fora da aplicação; configure a menor retenção possível e documente-a aqui ao implantar.

### Estado atual e TODOs

- [x] Programas de 2026 obtidos pelos Dados Abertos do TSE (`proposta_governo_2026_BR.zip`); o portal do TSE segue bloqueando acesso automatizado, mas o CDN oficial de dados abertos responde.
- [x] 104 posições (52 perguntas × 2 candidatos) com evidências importadas e publicadas; painel `/admin/posicoes` com auditoria.
- [x] Deploy no Railway (ver `DEPLOY.md`): Postgres, migrações no start, seed e importação via SSH.
- [ ] **TODO(ingestão)** Implementar `SenadoAdapter` e `TseAdapter`; concluir `CamaraAdapter` (autores, tramitações, votos) e persistência de `RawDocument`.
- [ ] **TODO(revisão)** Tela de revisão cega por evidência (`EvidenceReview`) e endpoints POST de evidência.
- [ ] **TODO(conteúdo)** Três perguntas de Lula seguem sem posição documentada (drogas, barrar obras por impacto ambiental, religião na política); declarações sem link oficial (TV, entrevistas) não entram.
- [ ] Verificação manual pendente: endereços dos documentos no portal do TSE (bloqueia acesso automatizado; links apontam para a página oficial das Eleições 2026), Biblioteca da Presidência, OCDE, atuação de Flávio Bolsonaro na ALERJ (2003–2019) e candidatura de Lula ao Governo de SP em 1982.

### Deploy

Produção no Railway (serviço `voce-decide` + Postgres). Passo a passo, variáveis e comandos de seed/importação em `DEPLOY.md`.

### Como contribuir

- Toda alteração de pergunta, critério ou classificação exige nova entrada em `METHODOLOGY_VERSIONS` (nunca apague versões anteriores).
- Nenhum fato político entra no banco sem `Source` consultável. O conhecimento do modelo de linguagem não é fonte.
- Rode `npm test` antes de abrir PR: os testes de neutralidade e publicação são obrigatórios.
- Projeto anterior (quiz estático) preservado em `legacy-static/` apenas como referência histórica.
