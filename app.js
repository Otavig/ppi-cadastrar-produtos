import express from "express";

const app = express();
const PORT = 3000;

const produtos = [];

const paginaCadastrarProduto = 
`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Produto</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <style>
        body { background-color: #f8f9fa; }
        .container { max-width: 700px; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        h1 { color: #0d6efd; margin-bottom: 30px; }
        .form-label { font-weight: 600; }
        .error-msg { color: red; font-size: 0.875em; display: none; margin-top: 3px; }
        button { min-width: 120px; }
        .btn-secondary { margin-left: 10px; }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; }
    </style>
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center">Cadastro de Produto</h1>

        <form id="formProduto" action="/cadastrar-produto" method="POST" novalidate>
            <div class="mb-3">
                <label for="produtoNome" class="form-label">Nome do produto</label>
                <input type="text" class="form-control" id="produtoNome" name="nome" placeholder="Digite o nome do produto..." required>
                <span class="error-msg" id="erroNome">Não pode estar vazio.</span>
            </div>

            <div class="form-floating mb-3">
                <textarea class="form-control" placeholder="O produto é fabricado pela empresa X..." id="produtoDescricao" name="descricao" style="height: 100px; resize: none;" required></textarea>
                <label for="produtoDescricao">Descrição do produto</label>
                <span class="error-msg" id="erroDescricao">Não pode estar vazio.</span>
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="produtoPreco" class="form-label">Preço do produto</label>
                    <input type="number" class="form-control" id="produtoPreco" name="preco" value="0" step="0.01" required>
                    <span class="error-msg" id="erroPreco">Deve ser um número positivo.</span>
                </div>
                <div class="col-md-6">
                    <label for="produtoQuantidade" class="form-label">Quantidade do produto</label>
                    <input type="number" class="form-control" id="produtoQuantidade" name="quantidade" value="0" required>
                    <span class="error-msg" id="erroQuantidade">Deve ser um número positivo.</span>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="produtoDataFabricacao" class="form-label">Data de fabricação</label>
                    <input type="date" class="form-control" id="produtoDataFabricacao" name="dataFabricacao" required>
                    <span class="error-msg" id="erroDataFabricacao">Campo obrigatório.</span>
                </div>
                <div class="col-md-6">
                    <label for="produtoDataValidade" class="form-label">Data de vencimento</label>
                    <input type="date" class="form-control" id="produtoDataValidade" name="dataValidade" required>
                    <span class="error-msg" id="erroDataValidade">Campo obrigatório e não pode ser anterior à fabricação.</span>
                </div>
            </div>

            <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-primary">Cadastrar</button>
                <a href="/pagina-visualizar-produtos" class="btn btn-secondary">Consultar</a>
            </div>
        </form>
    </div>

    <script>
        const form = document.getElementById('formProduto');

        const campos = {
            nome: document.getElementById('produtoNome'),
            descricao: document.getElementById('produtoDescricao'),
            preco: document.getElementById('produtoPreco'),
            quantidade: document.getElementById('produtoQuantidade'),
            dataFabricacao: document.getElementById('produtoDataFabricacao'),
            dataValidade: document.getElementById('produtoDataValidade')
        };

        const erros = {
            nome: document.getElementById('erroNome'),
            descricao: document.getElementById('erroDescricao'),
            preco: document.getElementById('erroPreco'),
            quantidade: document.getElementById('erroQuantidade'),
            dataFabricacao: document.getElementById('erroDataFabricacao'),
            dataValidade: document.getElementById('erroDataValidade')
        };

        function validarCampo() {
            let valido = true;

            if (campos.nome.value.trim() === "") {
                erros.nome.style.display = "block";
                valido = false;
            } else { erros.nome.style.display = "none"; }

            if (campos.descricao.value.trim() === "") {
                erros.descricao.style.display = "block";
                valido = false;
            } else { erros.descricao.style.display = "none"; }

            if (parseFloat(campos.preco.value) < 0 || campos.preco.value === "") {
                erros.preco.style.display = "block";
                valido = false;
            } else { erros.preco.style.display = "none"; }

            if (parseInt(campos.quantidade.value) < 0 || campos.quantidade.value === "") {
                erros.quantidade.style.display = "block";
                valido = false;
            } else { erros.quantidade.style.display = "none"; }

            if (!campos.dataFabricacao.value) {
                erros.dataFabricacao.style.display = "block";
                valido = false;
            } else { erros.dataFabricacao.style.display = "none"; }

            if (!campos.dataValidade.value || (campos.dataFabricacao.value && campos.dataValidade.value < campos.dataFabricacao.value)) {
                erros.dataValidade.style.display = "block";
                valido = false;
            } else { erros.dataValidade.style.display = "none"; }

            return valido;
        }

        form.addEventListener('submit', function(e) {
            if (!validarCampo()) e.preventDefault();
        });

        // Inicializa datas
        const hoje = new Date().toISOString().split('T')[0];
        if (!campos.dataFabricacao.value) campos.dataFabricacao.value = hoje;
        if (!campos.dataValidade.value) campos.dataValidade.value = hoje;
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
</body>
</html>
`;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/cadastrar-produto", (req, res) => {
    const { nome, descricao, preco, quantidade, dataFabricacao, dataValidade } = req.body;

    const erros = [];

    if (!nome || nome.trim() === "") erros.push("O nome do produto é obrigatório.");
    if (!descricao || descricao.trim() === "") erros.push("A descrição do produto é obrigatória.");
    
    const precoNum = parseFloat(preco);
    if (isNaN(precoNum) || precoNum < 0) erros.push("O preço deve ser um número positivo.");

    const quantidadeNum = parseInt(quantidade);
    if (isNaN(quantidadeNum) || quantidadeNum < 0) erros.push("A quantidade deve ser um número positivo.");

    if (!dataFabricacao) erros.push("A data de fabricação é obrigatória.");
    if (!dataValidade) erros.push("A data de validade é obrigatória.");

    if (dataFabricacao && dataValidade && new Date(dataValidade) < new Date(dataFabricacao)) {
        erros.push("A data de validade não pode ser anterior à data de fabricação.");
    }

    if (erros.length > 0) {
        let mensagemErro = erros.join("<br>");
        return res.send(`
            <div style="max-width:600px;margin:50px auto;padding:20px;border:1px solid red;background:#ffe6e6;">
                <h3>Erro ao cadastrar produto:</h3>
                <p>${mensagemErro}</p>
                <a href="/" style="display:inline-block;margin-top:20px;">Voltar</a>
            </div>
        `);
    }

    const produto = {
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: precoNum,
        quantidade: quantidadeNum,
        dataFabricacao,
        dataValidade
    };

    produtos.push(produto);
    res.redirect("/pagina-visualizar-produtos");
});

app.get("/pagina-visualizar-produtos", (req, res) => {
    let tabelaProdutos = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Produtos Cadastrados</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
        <style>
            body {
                background-color: #f8f9fa;
            }
            .container {
                max-width: 900px;
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            h1 {
                color: #0d6efd;
                margin-bottom: 30px;
            }
            table th, table td {
                vertical-align: middle;
            }
            .btn-primary {
                min-width: 150px;
            }
        </style>
    </head>
    <body>
        <div class="container mt-5">
            <h1 class="text-center mb-4">Produtos Cadastrados</h1>
            <table class="table table-striped table-bordered">
                <thead class="table-dark">
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Preço</th>
                        <th>Quantidade</th>
                        <th>Data de Fabricação</th>
                        <th>Data de Validade</th>
                    </tr>
                </thead>
                <tbody>
    `;

    produtos.forEach(p => {
        tabelaProdutos += `
            <tr>
                <td>${p.nome}</td>
                <td>${p.descricao}</td>
                <td>R$ ${p.preco.toFixed(2)}</td>
                <td>${p.quantidade}</td>
                <td>${p.dataFabricacao}</td>
                <td>${p.dataValidade}</td>
            </tr>
        `;
    });

    tabelaProdutos += `
                </tbody>
            </table>
            <div class="d-flex justify-content-center mt-4">
                <a href="/" class="btn btn-primary">Cadastrar Novo Produto</a>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    </body>
    </html>
    `;

    res.send(tabelaProdutos);
});

// Middleware para levar para a pagina princpal sempre
app.use((req, res) => {
    res.send(paginaCadastrarProduto);
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}/ !!!`));
