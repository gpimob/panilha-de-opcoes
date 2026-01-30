// ==================================================
// ALERTA AO CORRETOR (AO CARREGAR A PÁGINA)
// ==================================================
alert(
  "Olá corretor parceiro!\n\n" +
  "Você está acessando minha planilha de opções diretas atualizada.\n\n" +
  "Ao clicar no nome de cada opção, você será redirecionado para uma pasta no Drive " +
  "com fotos e descrição do imóvel."
);

// ==================================================
// VARIÁVEIS DE ESTADO
// ==================================================
let dadosOriginais = [];   // Dados vindos do JSON
let dadosVisiveis = [];    // Dados filtrados/ordenados
let ordemCrescente = true;

// ==================================================
// ELEMENTOS DO DOM
// ==================================================
const tbody = document.getElementById("tabela-dados");

const inputNome = document.getElementById("search-nome");
const inputBairro = document.getElementById("search-bairro");
const inputValor = document.getElementById("search-valor");
const inputTipologia = document.getElementById("search-tipologia");

const btnLimpar = document.getElementById("limpar");
const btnOrdenar = document.getElementById("ordenar");

// ==================================================
// FUNÇÕES AUXILIARES
// ==================================================

// Formata valor numérico para padrão brasileiro
function formatarValor(valor) {
  if (typeof valor !== "number") return valor;
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// ==================================================
// RENDERIZAÇÃO DA TABELA
// ==================================================
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
        <td>${i.bairro ?? "-"}</td>
        <td>${formatarValor(i.valor)}</td>
        <td>${i.tipologia ?? "-"}</td>
      </tr>
    `;
  });
}

// ==================================================
// FILTROS
// ==================================================
function aplicarFiltros() {
  const nome = inputNome.value.toLowerCase();
  const bairro = inputBairro.value.toLowerCase();
  const valor = inputValor.value;
  const tipologia = inputTipologia.value.toLowerCase();

  dadosVisiveis = dadosOriginais.filter(i => {
    return (
      (!nome || i.nome?.toLowerCase().includes(nome)) &&
      (!bairro || i.bairro?.toLowerCase().includes(bairro)) &&
      (!valor || String(i.valor).includes(valor)) &&
      (!tipologia || i.tipologia?.toLowerCase().includes(tipologia))
    );
  });

  renderTabela(dadosVisiveis);
}

// ==================================================
// EVENTOS DE FILTRO
// ==================================================
[inputNome, inputBairro, inputValor, inputTipologia]
  .forEach(input => input.addEventListener("input", aplicarFiltros));

// ==================================================
// ORDENAÇÃO POR VALOR
// ==================================================
btnOrdenar.onclick = () => {
  dadosVisiveis.sort((a, b) =>
    ordemCrescente ? a.valor - b.valor : b.valor - a.valor
  );

  ordemCrescente = !ordemCrescente;
  renderTabela(dadosVisiveis);
};

// ==================================================
// LIMPAR FILTROS
// ==================================================
btnLimpar.onclick = () => {
  inputNome.value = "";
  inputBairro.value = "";
  inputValor.value = "";
  inputTipologia.value = "";

  dadosVisiveis = [...dadosOriginais];
  renderTabela(dadosVisiveis);
};

// ==================================================
// CARREGAMENTO DO JSON
// ==================================================
fetch("./data/imoveis.json")
  .then(res => res.json())
  .then(dados => {
    dadosOriginais = dados;
    dadosVisiveis = [...dados];
    renderTabela(dadosVisiveis);
  })
  .catch(err => {
    console.error("Erro ao carregar imoveis.json:", err);
  });
