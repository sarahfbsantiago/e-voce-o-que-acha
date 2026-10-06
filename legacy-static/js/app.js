// =====================================================
// LÓGICA DO QUESTIONÁRIO
// =====================================================

const LETRAS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SEGUNDOS_POR_PERGUNTA = 15; // usado só para estimar a duração na tela inicial

// ---- Estado ----
let indiceAtual = 0;
let respostas = []; // respostas[i] = índice da opção escolhida na pergunta i

// ---- Elementos ----
const telas = {
  inicio: document.getElementById("tela-inicio"),
  quiz: document.getElementById("tela-quiz"),
  resultado: document.getElementById("tela-resultado")
};

const el = {
  metaPerguntas: document.getElementById("meta-perguntas"),
  metaTempo: document.getElementById("meta-tempo"),
  perguntaTexto: document.getElementById("pergunta-texto"),
  opcoes: document.getElementById("opcoes"),
  progressoBarra: document.getElementById("progresso-barra"),
  progressoPreenchido: document.getElementById("progresso-preenchido"),
  progressoTexto: document.getElementById("progresso-texto"),
  progressoPorcento: document.getElementById("progresso-porcento"),
  btnComecar: document.getElementById("btn-comecar"),
  btnVoltar: document.getElementById("btn-voltar"),
  btnAvancar: document.getElementById("btn-avancar"),
  btnAvancarTexto: document.getElementById("btn-avancar-texto"),
  btnRefazer: document.getElementById("btn-refazer"),
  btnCopiar: document.getElementById("btn-copiar"),
  btnCopiarTexto: document.getElementById("btn-copiar-texto"),
  linkMarca: document.getElementById("link-marca"),
  anelValor: document.getElementById("anel-valor"),
  resultadoPorcento: document.getElementById("resultado-porcento"),
  resultadoTitulo: document.getElementById("resultado-titulo"),
  resultadoPontos: document.getElementById("resultado-pontos"),
  resultadoDescricao: document.getElementById("resultado-descricao"),
  escalaFaixas: document.getElementById("escala-faixas")
};

const ICONE_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

// ---- Navegação entre telas ----
function mostrarTela(nome) {
  Object.values(telas).forEach(t => t.classList.remove("ativa"));
  telas[nome].classList.add("ativa");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---- Tela inicial ----
function preencherMetaInicial() {
  const total = PERGUNTAS.length;
  const minutos = Math.max(1, Math.round((total * SEGUNDOS_POR_PERGUNTA) / 60));
  el.metaPerguntas.textContent = total;
  el.metaTempo.textContent = `~${minutos} min`;
}

// ---- Renderização da pergunta ----
function renderizarPergunta() {
  const pergunta = PERGUNTAS[indiceAtual];
  const total = PERGUNTAS.length;
  const porcento = Math.round((indiceAtual / total) * 100);

  el.perguntaTexto.textContent = pergunta.texto;
  el.progressoTexto.textContent = `Pergunta ${indiceAtual + 1} de ${total}`;
  el.progressoPorcento.textContent = `${porcento}% concluído`;
  el.progressoPreenchido.style.width = `${porcento}%`;
  el.progressoBarra.setAttribute("aria-valuenow", porcento);

  el.opcoes.innerHTML = "";
  pergunta.opcoes.forEach((opcao, i) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "opcao";
    botao.setAttribute("role", "radio");
    const selecionada = respostas[indiceAtual] === i;
    botao.setAttribute("aria-checked", selecionada);
    if (selecionada) botao.classList.add("selecionada");

    botao.innerHTML = `
      <span class="opcao-letra">${LETRAS[i] || i + 1}</span>
      <span class="opcao-texto"></span>
      <span class="opcao-check">${ICONE_CHECK}</span>
    `;
    botao.querySelector(".opcao-texto").textContent = opcao.texto;
    botao.addEventListener("click", () => selecionarOpcao(i));
    el.opcoes.appendChild(botao);
  });

  el.btnVoltar.disabled = indiceAtual === 0;
  el.btnAvancar.disabled = respostas[indiceAtual] === undefined;
  el.btnAvancarTexto.textContent = indiceAtual === total - 1 ? "Ver resultado" : "Avançar";
}

function selecionarOpcao(indiceOpcao) {
  respostas[indiceAtual] = indiceOpcao;
  renderizarPergunta();
}

// ---- Cálculo de pontuação ----
function calcularPontuacao() {
  return PERGUNTAS.reduce((soma, pergunta, i) => {
    const opcao = pergunta.opcoes[respostas[i]];
    return soma + (opcao ? opcao.pontos : 0);
  }, 0);
}

function pontuacaoMaxima() {
  return PERGUNTAS.reduce((soma, pergunta) => {
    return soma + Math.max(...pergunta.opcoes.map(o => o.pontos));
  }, 0);
}

function obterResultado(porcentagem) {
  // RESULTADOS está ordenado do maior "min" para o menor
  return RESULTADOS.find(r => porcentagem >= r.min) || RESULTADOS[RESULTADOS.length - 1];
}

// ---- Tela de resultado ----
function renderizarEscala(resultadoAtual) {
  el.escalaFaixas.innerHTML = "";
  RESULTADOS.forEach((faixa, i) => {
    const max = i === 0 ? 100 : RESULTADOS[i - 1].min;
    const item = document.createElement("div");
    item.className = "escala-faixa" + (faixa === resultadoAtual ? " atual" : "");
    item.innerHTML = `
      <div class="escala-faixa-topo">
        <span class="escala-faixa-nome"></span>
        <span class="escala-faixa-intervalo">${faixa.min}% – ${max}%</span>
      </div>
      <div class="escala-faixa-barra"><span style="width:${max}%"></span></div>
    `;
    item.querySelector(".escala-faixa-nome").textContent = faixa.titulo;
    el.escalaFaixas.appendChild(item);
  });
}

let resultadoAtualTexto = "";

function mostrarResultado() {
  const pontos = calcularPontuacao();
  const maximo = pontuacaoMaxima();
  const porcentagem = Math.round((pontos / maximo) * 100);
  const resultado = obterResultado(porcentagem);

  el.resultadoTitulo.textContent = resultado.titulo;
  el.resultadoPontos.textContent = `${pontos} de ${maximo} pontos`;
  el.resultadoDescricao.textContent = resultado.descricao;
  el.resultadoPorcento.textContent = `${porcentagem}%`;
  renderizarEscala(resultado);

  resultadoAtualTexto = `Meu resultado na Pesquisa de Perfil: ${resultado.titulo} (${porcentagem}% de afinidade, ${pontos}/${maximo} pontos).`;
  el.btnCopiarTexto.textContent = "Copiar resultado";

  mostrarTela("resultado");

  // anima o anel depois que a tela aparece
  const circunferencia = 2 * Math.PI * 52;
  el.anelValor.style.strokeDashoffset = circunferencia;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.anelValor.style.strokeDashoffset = circunferencia * (1 - porcentagem / 100);
    });
  });
}

async function copiarResultado() {
  try {
    await navigator.clipboard.writeText(resultadoAtualTexto);
    el.btnCopiarTexto.textContent = "Copiado!";
  } catch {
    el.btnCopiarTexto.textContent = "Não foi possível copiar";
  }
  setTimeout(() => { el.btnCopiarTexto.textContent = "Copiar resultado"; }, 2000);
}

// ---- Controle de fluxo ----
function iniciar() {
  indiceAtual = 0;
  respostas = [];
  renderizarPergunta();
  mostrarTela("quiz");
}

function voltarAoInicio(evento) {
  evento.preventDefault();
  indiceAtual = 0;
  respostas = [];
  mostrarTela("inicio");
}

function avancar() {
  if (respostas[indiceAtual] === undefined) return;
  if (indiceAtual < PERGUNTAS.length - 1) {
    indiceAtual++;
    renderizarPergunta();
  } else {
    mostrarResultado();
  }
}

function voltar() {
  if (indiceAtual > 0) {
    indiceAtual--;
    renderizarPergunta();
  }
}

// ---- Atalhos de teclado (1-9 escolhe, Enter avança) ----
document.addEventListener("keydown", (e) => {
  if (!telas.quiz.classList.contains("ativa")) return;
  const numero = parseInt(e.key, 10);
  if (numero >= 1 && numero <= PERGUNTAS[indiceAtual].opcoes.length) {
    selecionarOpcao(numero - 1);
  } else if (e.key === "Enter" && !el.btnAvancar.disabled) {
    avancar();
  }
});

// ---- Eventos ----
el.btnComecar.addEventListener("click", iniciar);
el.btnAvancar.addEventListener("click", avancar);
el.btnVoltar.addEventListener("click", voltar);
el.btnRefazer.addEventListener("click", iniciar);
el.btnCopiar.addEventListener("click", copiarResultado);
el.linkMarca.addEventListener("click", voltarAoInicio);

// ---- Inicialização ----
preencherMetaInicial();
