// ===== ALERTA AO CORRETOR =====
alert(
  "Olá corretor parceiro!\n\n" +
  "Você está acessando minha planilha de opções diretas atualizada.\n\n" +
  "Ao clicar no nome de cada opção, você será redirecionado para uma pasta no Drive " +
  "com fotos e descrição do imóvel."
);

// ===== VARIÁVEIS =====
let dadosOriginais = [];
let dadosVisiveis = [];
let ordemCrescente = true;

// ===== DOM =====
const tbody = document.getElementById("tabela-dados");
const inputNome = document.getElementById("search-nome");
const inputBairro = document.getElementById("search-bairro");
const inputValor = document.getElementById("search-valor");
const inputTipologia = document.getElementById("search-tipologia");
const btnLimpar = document.getElementById("limpar");
const btnOrdenar = document.getElementById("ordenar");

// ===== FUNÇÕES =====
function valorNumerico(valor) {
  return Number(valor.replace("R$", "").replace(/\./g, "").replace(",", "."));
}

function renderTabela(lista) {
  tbody.innerHTML = "";
  lista.forEach(i => {
    tbody.innerHTML += `
      <tr>
        <td>
          <a href="${i.url}" target="_blank" class="link-imovel">${i.nome}</a>
        </td>
        <td>${i.bairro}</td>
        <td>${i.valor}</td>
        <td>${i.tipologia}</td>
      </tr>
    `;
  });
}

function aplicarFiltros() {
  dadosVisiveis = dadosOriginais.filter(i =>
    i.nome.toLowerCase().includes(inputNome.value.toLowerCase()) &&
    i.bairro.toLowerCase().includes(inputBairro.value.toLowerCase()) &&
    i.valor.toLowerCase().includes(inputValor.value.toLowerCase()) &&
    i.tipologia.toLowerCase().includes(inputTipologia.value.toLowerCase())
  );
  renderTabela(dadosVisiveis);
}

// ===== EVENTOS =====
[inputNome, inputBairro, inputValor, inputTipologia]
  .forEach(input => input.addEventListener("input", aplicarFiltros));

btnOrdenar.onclick = () => {
  dadosVisiveis.sort((a, b) =>
    ordemCrescente
      ? valorNumerico(a.valor) - valorNumerico(b.valor)
      : valorNumerico(b.valor) - valorNumerico(a.valor)
  );
  ordemCrescente = !ordemCrescente;
  renderTabela(dadosVisiveis);
};

btnLimpar.onclick = () => {
  inputNome.value = "";
  inputBairro.value = "";
  inputValor.value = "";
  inputTipologia.value = "";
  renderTabela(dadosOriginais);
};

// ===== CARREGA DADOS DO JSON =====
fetch("./data/imoveis.json")
  .then(res => res.json())
  .then(dados => {
    dadosOriginais = dados;
    dadosVisiveis = [...dados];
    renderTabela(dados);
  });
