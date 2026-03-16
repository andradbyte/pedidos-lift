const API = "https://sistemalift1.com.br/lift_ps/api/";

async function carregarPedidos() {
    try {
        let resposta = await fetch(API + "Pedidos");
        let pedidos = await resposta.json();

        let tabela = document.querySelector("#tabelaPedidos tbody");
        tabela.innerHTML = "";

        for (let pedido of pedidos) {
            let clienteResp = await fetch(API + "Clientes/" + pedido.cliente);
            let cliente = await clienteResp.json();
            let nomeCliente = cliente.nome || pedido.cliente;

            let linha = `
            <tr onclick="abrirPedido(${pedido.id})">
                <td>${pedido.id}</td>
                <td>${nomeCliente}</td>
                <td>${pedido.data}</td>
                <td>Ver detalhes</td>
            </tr>
            `;
            tabela.innerHTML += linha;
        }
    } catch (erro) {
        console.error("Erro ao carregar pedidos:", erro);
    }
}

function abrirPedido(id) {
    window.location = "pedido.html?id=" + id;
}

async function carregarPedido() {
    try {
        let params = new URLSearchParams(window.location.search);
        let id = params.get("id");

        let pedidoResp = await fetch(API + "Pedidos/" + id);
        let pedido = await pedidoResp.json();

        let clienteResp = await fetch(API + "Clientes/" + pedido.cliente);
        let cliente = await clienteResp.json();
        let nomeCliente = cliente.nome || pedido.cliente;

        document.getElementById("cliente").innerHTML = `
            <b>Nome:</b> ${nomeCliente} <br>
            <b>CPF:</b> ${cliente.cpf || "-"} <br>
            <b>Email:</b> ${cliente.email || "-"}
        `;

        let itensResp = await fetch(API + "ItensPedido/" + id);
        let itens = await itensResp.json();

        let tabela = document.querySelector("#itens tbody");
        tabela.innerHTML = "";

        let total = 0;
        for (let item of itens) {
            let prodResp = await fetch(API + "Produtos/" + item.produto);
            let produto = await prodResp.json();

            let valor = produto.valor * item.quantidade;
            total += valor;

            tabela.innerHTML += `
            <tr>
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${item.quantidade}</td>
                <td>R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
            </tr>
            `;
        }

        document.getElementById("total").innerText =
"Total: R$ " + total.toLocaleString("pt-BR", { minimumFractionDigits: 2 });;
    } catch (erro) {
        console.error("Erro ao carregar detalhes do pedido:", erro);
    }
}

if (document.getElementById("tabelaPedidos")) {
    carregarPedidos();
}
if (document.getElementById("itens")) {
    carregarPedido();
}