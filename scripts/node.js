const express = require('express');
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Definir o caminho para o arquivo JSON onde os produtos serão armazenados
const produtosFilePath = './produtos.json';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Servir arquivos estáticos (como imagens)

// Configurar o armazenamento de arquivos (usando o multer para imagens)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Pasta onde as imagens serão armazenadas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome único para a imagem
    }
});
const upload = multer({ storage });

// Função para ler os produtos do arquivo JSON
const lerProdutos = () => {
    if (!fs.existsSync(produtosFilePath)) {
        return []; // Retorna um array vazio se o arquivo não existir
    }
    const data = fs.readFileSync(produtosFilePath);
    return JSON.parse(data);
};

// Função para salvar os produtos no arquivo JSON
const salvarProdutos = (produtos) => {
    fs.writeFileSync(produtosFilePath, JSON.stringify(produtos, null, 2));
};

// Rota para adicionar um produto
app.post('/api/produtos', upload.single('imagem'), (req, res) => {
    const { nome, preco } = req.body;
    const imagem = req.file.filename; // O nome do arquivo da imagem

    const produtos = lerProdutos(); // Lê os produtos atuais
    const novoProduto = {
        id: produtos.length + 1,
        nome,
        preco,
        imagem
    };

    produtos.push(novoProduto); // Adiciona o novo produto ao array
    salvarProdutos(produtos); // Salva no arquivo JSON

    res.status(201).json(novoProduto); // Retorna o produto adicionado
});

// Rota para listar todos os produtos
app.get('/api/produtos', (req, res) => {
    const produtos = lerProdutos(); // Lê os produtos do arquivo
    res.status(200).json(produtos); // Retorna os produtos para o frontend
});

// Inicializando o servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
