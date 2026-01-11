// ================= ALERTA AO CORRETOR (APARECE APENAS UMA VEZ) =================
if (!localStorage.getItem("alertaCorretor")) {
  alert(
    "Olá corretor parceiro!\n\n" +
    "Você está acessando minha planilha de opções diretas atualizada.\n\n" +
    "Ao clicar no nome de cada opção, você será redirecionado para uma pasta no Drive " +
    "contendo as fotos e a descrição de cada imóvel."
  );
  localStorage.setItem("alertaCorretor", "true");
}

// ================= DADOS ORIGINAIS =================
// Cada imóvel pode conter uma URL (Drive, PDF, site, etc)
const dadosOriginais = [
  { 
    nome: "Aloha", 
    bairro: "Barra da Tijuca", 
    valor: "R$ 1.110.000", 
    tipologia: "2qts",
    url: "https://exemplo.com/aloha"
  },
  { 
    nome: "Alphagreen", 
    bairro: "Barra da Tijuca", 
    valor: "R$ 1.100.000", 
    tipologia: "2qts",
    url: "https://exemplo.com/alphagreen"
  },
  { 
    nome: "Barra Bali - Beach", 
    bairro: "Barra da Tijuca", 
    valor: "R$ 760.000", 
    tipologia: "3qts",
    url: "https://exemplo.com/barra-bali"
  },
  { 
    nome: "Barramares", 
    bairro: "Barra da Tijuca", 
    valor: "R$ 5.900.000", 
    tipologia: "4qts",
    url: "https://exemplo.com/barramares"
  }
];

// ================= ESTADO DA APLICAÇÃO =================
let dadosVisiveis = [...dadosOriginais];
let ordemCrescente = true;

// ================= ELEMENTOS DO DOM =================
const tbody = document.getElementById("tabela-dados");

const inputNome = document.getElementById("search-nome");
const inputBairro = document.getElementById("search-bairro");
const inputValor = document.getElementById("search-valor");
const inputTipologia = document.getElementById("search-tipologia");

const btnLimpar = document.getElementById("limpar");
const btnOrdenar = document.getElementById("ordenar");

// ================= FUNÇÕES AUXILIARES =================
// Converte valor monetário para número (para ordenação)
function valorNumerico(valor) {
  return Number(
    valor
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  );
}

// ================= RENDERIZAÇÃO DA TABELA =================
// Monta a tabela dinamicamente
function renderTabela(lista) {
  tbody.innerHTML = "";

  lista.forEach(i => {
    tbody.innerHTML += `
      <tr>
        <td>
          ${
            i.url
              ? `<a href="${i.url}" target="_blank" class="link-imovel">${i.nome}</a>`
              : i.nome
          }
        </td>
        <td>${i.bairro}</td>
        <td>${i.valor}</td>
        <td>${i.tipologia}</td>
      </tr>
    `;
  });
}

// ================= FILTROS =================
// Aplica filtros conforme o usuário digita
function aplicarFiltros() {
  dadosVisiveis = dadosOriginais.filter(i =>
    (!inputNome.value || i.nome.toLowerCase().includes(inputNome.value.toLowerCase())) &&
    (!inputBairro.value || i.bairro.toLowerCase().includes(inputBairro.value.toLowerCase())) &&
    (!inputValor.value || i.valor.toLowerCase().includes(inputValor.value.toLowerCase())) &&
    (!inputTipologia.value || i.tipologia.toLowerCase().includes(inputTipologia.value.toLowerCase()))
  );

  renderTabela(dadosVisiveis);
}

// ================= AÇÕES =================
// Ordenar por valor (crescente / decrescente)
btnOrdenar.onclick = () => {
  dadosVisiveis.sort((a, b) =>
    ordemCrescente
      ? valorNumerico(a.valor) - valorNumerico(b.valor)
      : valorNumerico(b.valor) - valorNumerico(a.valor)
  );

  ordemCrescente = !ordemCrescente;
  renderTabela(dadosVisiveis);
};

// Limpar filtros e restaurar lista original
btnLimpar.onclick = () => {
  inputNome.value = "";
  inputBairro.value = "";
  inputValor.value = "";
  inputTipologia.value = "";

  dadosVisiveis = [...dadosOriginais];
  renderTabela(dadosVisiveis);
};

// ================= EVENTOS =================
// Dispara o filtro automaticamente ao digitar
[inputNome, inputBairro, inputValor, inputTipologia]
  .forEach(input => input.addEventListener("input", aplicarFiltros));

// ================= INICIALIZAÇÃO =================
// Renderiza a tabela ao carregar a página
renderTabela(dadosOriginais);
