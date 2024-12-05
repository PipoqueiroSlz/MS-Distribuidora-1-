// Referência ao elemento que exibirá os produtos
const listaProdutos = document.getElementById("produtos-lista");

// Função para renderizar os produtos na interface
function renderizarProdutos(lista) {
    listaProdutos.innerHTML = ""; // Limpa a lista antes de renderizar
    lista.forEach((produto) => {
        const produtoItem = document.createElement("div");
        produtoItem.classList.add("produto-item");
        produtoItem.innerHTML = `
            <h3>${produto.nome}</h3>
            <img src="public/uploads/${produto.imagem}" class="produto-imagem" alt="${produto.nome}">
            <p><strong>Preço:</strong> R$${produto.preco.toFixed(2)}</p>
        `;
        listaProdutos.appendChild(produtoItem);
    });
}

// Carregar os produtos ao iniciar a página
document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/produtos')
        .then(response => response.json())
        .then(produtos => {
            renderizarProdutos(produtos);
        })
        .catch(error => {
            console.error("Erro ao carregar os produtos:", error);
            listaProdutos.innerHTML = "<p>Erro ao carregar os produtos.</p>";
        });
});
