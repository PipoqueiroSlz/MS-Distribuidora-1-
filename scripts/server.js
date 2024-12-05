// Importando dependências
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 3000;

// Configuração do servidor para usar arquivos estáticos (imagens, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Usando o middleware para processar dados de formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração do Multer para salvar imagens enviadas pelo formulário
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Salva o arquivo com timestamp
    }
});
const upload = multer({ storage });

// Rota para exibir os produtos no catálogo (GET)
app.get('/api/produtos', (req, res) => {
    fs.readFile('produtos.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler o arquivo de produtos');
        }
        res.json(JSON.parse(data));
    });
});

// Rota para adicionar um novo produto (POST)
app.post('/api/produtos', upload.single('imagem'), (req, res) => {
    const { nome, preco } = req.body;
    const imagem = req.file ? req.file.filename : null; // Nome do arquivo de imagem
    const produto = { id: Date.now(), nome, preco: parseFloat(preco), imagem };

    // Lendo os produtos existentes
    fs.readFile('produtos.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erro ao ler o arquivo de produtos');
        }

        const produtos = JSON.parse(data);
        produtos.push(produto); // Adicionando o novo produto

        // Escrevendo os produtos atualizados no arquivo
        fs.writeFile('produtos.json', JSON.stringify(produtos, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar o produto');
            }
            res.status(201).send('Produto adicionado com sucesso!');
        });
    });
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
