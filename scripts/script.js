// ===== ALERTA AO CORRETOR =====
alert(
  "Olá corretor parceiro e cliente!\n\n" +
  "Você está acessando minha planilha de opções diretas atualizada.\n\n" +
  "Ao clicar no nome do imóvel, você será redirecionado para a pasta com fotos e descrição."
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
const inputCondominio = document.getElementById("search-condominio");

const btnLimpar = document.getElementById("limpar");
const btnOrdenar = document.getElementById("ordenar");

// ===== FUNÇÕES =====
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

// ===== RENDERIZA TABELA =====
function renderTabela(lista) {
  tbody.innerHTML = "";

  lista.forEach(i => {
    tbody.innerHTML += `
      <tr>
        <td data-label="Imóvel">
          <a href="${i.url}" target="_blank" class="link-imovel">
            ${i["Nome do imovel"]}
          </a>
        </td>
        <td data-label="Bairro">${i.Bairro}</td>
        <td data-label="Valor">${i.Valor}</td>
        <td data-label="Tipologia">${i.Tipologia}</td>
        <td data-label="Condomínio">${i.Condominio || "-"}</td>
      </tr>
    `;
  });
}

// ===== FILTROS =====
function aplicarFiltros() {
  dadosVisiveis = dadosOriginais.filter(i =>
    i["Nome do imovel"].toLowerCase().includes(inputNome.value.toLowerCase()) &&
    i.Bairro.toLowerCase().includes(inputBairro.value.toLowerCase()) &&
    String(i.Valor).toLowerCase().includes(inputValor.value.toLowerCase()) &&
    i.Tipologia.toLowerCase().includes(inputTipologia.value.toLowerCase()) &&
    (i.Condominio || "").toLowerCase().includes(inputCondominio.value.toLowerCase())
  );

  renderTabela(dadosVisiveis);
}

// ===== EVENTOS =====
[inputNome, inputBairro, inputValor, inputTipologia, inputCondominio]
  .forEach(input => input.addEventListener("input", aplicarFiltros));

btnOrdenar.onclick = () => {
  dadosVisiveis.sort((a, b) =>
    ordemCrescente
      ? valorNumerico(a.Valor) - valorNumerico(b.Valor)
      : valorNumerico(b.Valor) - valorNumerico(a.Valor)
  );

  ordemCrescente = !ordemCrescente;
  renderTabela(dadosVisiveis);
};

btnLimpar.onclick = () => {
  inputNome.value = "";
  inputBairro.value = "";
  inputValor.value = "";
  inputTipologia.value = "";
  inputCondominio.value = "";

  dadosVisiveis = [...dadosOriginais];
  renderTabela(dadosVisiveis);
};

// ===== CARREGA JSON =====
fetch("./data/imoveis.json")
  .then(res => res.json())
  .then(dados => {
    dadosOriginais = dados;
    dadosVisiveis = [...dados];
    renderTabela(dados);
  });
