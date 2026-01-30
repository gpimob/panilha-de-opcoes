// ===== ALERTA AO CORRETOR =====
alert(
  "Olá corretor parceiro!\n\n" +
  "Você está acessando minha planilha de opções diretas atualizada.\n\n" +
  "Ao clicar no nome do imóvel, você será redirecionado para a pasta com fotos e descrição."
);

// ===== VARIÁVEIS DE ESTADO =====
let dadosOriginais = [];
let dadosVisiveis = [];
let ordemCrescente = true;

// ===== ELEMENTOS DO DOM =====
const tbody = document.getElementById("tabela-dados");

const inputNome = document.getElementById("search-nome");
const inputBairro = document.getElementById("search-bairro");
const inputValor = document.getElementById("search-valor");
const inputTipologia = document.getElementById("search-tipologia");
const inputCondominio = document.getElementById("search-condominio");

const btnLimpar = document.getElementById("limpar");
const btnOrdenar = document.getElementById("ordenar");

// ===== FUNÇÃO: CONVERTE VALOR PARA NÚMERO =====
function valorNumerico(valor) {
  if (typeof valor === "number") return valor;

  return Number(
    valor
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  );
}

// ===== RENDERIZAÇÃO DA TABELA =====
function renderTabela(lista) {
  tbody.innerHTML = "";

  lista.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>
          <a href="${item.url}" target="_blank" class="link-imovel">
            ${item["Nome do imovel"] || "-"}
          </a>
        </td>
        <td>${item["Bairro"] || "-"}</td>
        <td>${item["Valor"] || "-"}</td>
        <td>${item["Tipologia"] || "-"}</td>
        <td>${item["Condominio"] || "-"}</td>
      </tr>
    `;
  });
}

// ===== FILTROS =====
function aplicarFiltros() {
  dadosVisiveis = dadosOriginais.filter(item =>
    (item["Nome do imovel"] || "").toLowerCase().includes(inputNome.value.toLowerCase()) &&
    (item["Bairro"] || "").toLowerCase().includes(inputBairro.value.toLowerCase()) &&
    String(item["Valor"] || "").toLowerCase().includes(inputValor.value.toLowerCase()) &&
    (item["Tipologia"] || "").toLowerCase().includes(inputTipologia.value.toLowerCase()) &&
    (item["Condominio"] || "").toLowerCase().includes(inputCondominio.value.toLowerCase())
  );

  renderTabela(dadosVisiveis);
}

// ===== EVENTOS DE FILTRO =====
[
  inputNome,
  inputBairro,
  inputValor,
  inputTipologia,
  inputCondominio
].forEach(input => input.addEventListener("input", aplicarFiltros));

// ===== ORDENAR POR VALOR =====
btnOrdenar.onclick = () => {
  dadosVisiveis.sort((a, b) =>
    ordemCrescente
      ? valorNumerico(a["Valor"]) - valorNumerico(b["Valor"])
      : valorNumerico(b["Valor"]) - valorNumerico(a["Valor"])
  );

  ordemCrescente = !ordemCrescente;
  renderTabela(dadosVisiveis);
};

// ===== LIMPAR FILTROS =====
btnLimpar.onclick = () => {
  inputNome.value = "";
  inputBairro.value = "";
  inputValor.value = "";
  inputTipologia.value = "";
  inputCondominio.value = "";

  dadosVisiveis = [...dadosOriginais];
  renderTabela(dadosVisiveis);
};

// ===== CARREGAR JSON =====
fetch("./data/imoveis.json")
  .then(res => res.json())
  .then(dados => {
    dadosOriginais = dados;
    dadosVisiveis = [...dados];
    renderTabela(dados);
  })
  .catch(err => {
    console.error("Erro ao carregar imoveis.json", err);
  });
