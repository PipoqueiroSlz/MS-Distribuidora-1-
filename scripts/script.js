// Referências aos elementos da interface
const formProduto = document.getElementById("form-produto");
const buscarInput = document.getElementById("buscar-nome");
const btnBuscar = document.getElementById("btn-buscar");
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

// Adicionar um produto ao catálogo
formProduto.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const imagem = document.getElementById("imagem").files[0]; // Arquivo de imagem

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("preco", preco);
    formData.append("imagem", imagem);

    fetch('/api/produtos', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(produto => {
        renderizarProdutos([produto]);
        alert(`Produto "${produto.nome}" adicionado com sucesso!`);
    })
    .catch(error => {
        console.error("Erro ao adicionar produto:", error);
        alert("Erro ao adicionar produto");
    });

    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("imagem").value = "";
});

// Buscar produtos pelo nome
btnBuscar.addEventListener("click", () => {
    const termo = buscarInput.value.toLowerCase();
    fetch(`/api/produtos`)
        .then(response => response.json())
        .then(produtos => {
            const resultados = produtos.filter((produto) =>
                produto.nome.toLowerCase().includes(termo)
            );

            if (resultados.length > 0) {
                renderizarProdutos(resultados);
            } else {
                listaProdutos.innerHTML = "<p>Nenhum produto encontrado.</p>";
            }
        });
});

// Carregar os produtos ao iniciar a página
document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/produtos')
        .then(response => response.json())
        .then(produtos => {
            renderizarProdutos(produtos);
        });
});
