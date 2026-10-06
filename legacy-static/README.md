# Site Questionário

Teste de perfil estilo "quiz de personalidade": o usuário responde perguntas,
cada resposta vale pontos, a soma define o resultado.

## Como rodar

Basta abrir `index.html` no navegador. Não precisa de servidor nem instalação.

## Estrutura

```
site-questionario/
├── index.html          # As 3 telas: início, quiz e resultado
├── css/style.css       # Estilos
├── js/perguntas.js     # DADOS: lista de perguntas e pontos de cada opção
├── js/resultados.js    # DADOS: faixas de resultado (em % da pontuação máxima)
└── js/app.js           # LÓGICA: navegação, soma de pontos, exibição do resultado
```

## Como adicionar perguntas

Em `js/perguntas.js`, copie um bloco e ajuste:

```js
{
  id: 5,
  texto: "Sua nova pergunta aqui?",
  opcoes: [
    { texto: "Sim, totalmente", pontos: 3 },
    { texto: "Em parte", pontos: 2 },
    { texto: "Pouco", pontos: 1 },
    { texto: "Não", pontos: 0 }
  ]
}
```

Para perguntas onde "sim" é a resposta negativa (ex.: "você costuma mentir?"),
basta inverter os pontos das opções.

## Como ajustar os resultados

Em `js/resultados.js`, cada faixa tem um `min` em porcentagem. Como o cálculo
usa a porcentagem da pontuação máxima, você pode adicionar quantas perguntas
quiser sem precisar recalcular os limites.
