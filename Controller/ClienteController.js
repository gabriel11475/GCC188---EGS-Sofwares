
const { redirect } = require("express/lib/response");
const cliente = require("../../src/Model/cliente");
const db = require('../../src/Persistence/db');

function sendcss(req, res) {
    res.sendFile('/src/view/style.css', { root: '..' });
}
function sendlogo(req, res) {
    res.sendFile('/src/view/imagens/logo.jpg', { root: '..' });
}

function sendTelaSucesso(req, res) {      //tela de sucesso
    res.sendFile('/src/view/tela_sucesso.html', { root: '..' });
}
function sendTelaErro(req, res) {        //tela de erro
    res.sendFile('/src/view/tela_erro.html', { root: '..' });
}

function sendTelaCrtlCliente(req, res) {     //tela do crud de cliente
    res.sendFile('/src/view/controle_cliente.html', { root: '..' });
    console.log("entrou controle");
}

function sendTelaCadCliente(req, res) {   //cadastrando clientes
    res.sendFile('/src/view/cadastrar_clientes.html', { root: '..' });  //envia formulario
    console.log("entrou cadastrar_cliente");
}
async function addCliente(req, res, next) {
    console.log("entrou add cliente");
    const result = req.body;
    console.log(result);
    var redirect = '/view/tela_erro.html';
    console.log(redirect);
    if (result != null) {
        var add=false;
        add= await cliente.addCliente(result);
        console.log(add);
        if(add==false){            
            console.log("entrou no add=false");
            redirect = '/view/tela_erro.html';
        }else{
            redirect ='/view/tela_sucesso.html';
        }
    }
    console.log(redirect);
    res.redirect(redirect);
}

function sendTelaExcluir(req, res) {
    res.sendFile('/src/view/excluir_cliente.html', { root: '..' });
    console.log("entrou no excluir cliente");
}

var lastpkpessoa = -1;
async function sendTelaExcluir2(req, res) {

    clientefordelete = await cliente.cliente.findAll({ where: { CPF: req.body.CPF } });
    if(clientefordelete!=null){
        lastpkpessoa = clientefordelete.idPessoa;
        res.render('mostrar_cliente', { cliente: clientefordelete[0] });
    }else{
        res.redirect("/view/tela_erro.html");
    }
}

async function deleteCliente(req, res) {
    if(await cliente.excluirCliente(req.body.pkpessoa)){
        lastpkpessoa = -1;
        res.redirect("/view/tela_sucesso.html");
    }else{
        res.redirect("/view/tela_erro.html");
    }
}

function sendTelaBuscarCliente(req, res) {
    res.sendFile('/src/view/pagina_buscar_cliente.html', { root: '..' });  //pega nome de cliente no form
}

async function mostrarClientes(req, res) {
    var procura = null;
    await db.sync;
    console.log("Entrou no exibirCliente");
    console.log(req.body);
    procura = await cliente.cliente.findAll({ where: { nomePessoa: req.body.nomePessoa } }); //faz select
    console.log(procura);
    if (procura != null) {
        res.render("informacoes_cliente", { pessoas: procura }); //exibe clientes com o nome
    }else{
        res.redirect('/view/tela_erro.html');
    }
}

function solicitarCpf(req, res) {
    res.sendFile('/src/view/solicitar_cpf.html', { root: '..' })  //solicita cpf
}

async function formattCliente(req, res) {
    const procura = await cliente.cliente.findAll({ where: { CPF: req.body.CPF } });
    console.log(procura);
    if(procura!=null){
        const pessoa = {
            nomePessoa: procura[0].nomePessoa,
            num: procura[0].Numero,
            tel: procura[0].Telefone,
            bai: procura[0].Bairro,
            log: procura[0].Logradouro,
            cpf: procura[0].CPF,
            cid: procura[0].Cidade
        }
        lastpkpessoa = procura[0].idPessoa;
        res.render("atualizar_cliente", { pessoa: pessoa });//gera formulario preenchido
    }else{
        res.redirect('/view/tela_erro.html');
    }
}
async function attCliente(req, res) {
    var redirect ="/view/tela_erro.html";
    if(await cliente.attCliente (lastpkpessoa, req)){
        redirect="/view/tela_sucesso.html";
    }else{
        redirect= "/view/tela_erro.html";
    }
    res.redirect(redirect);
}

module.exports = {
    attCliente, formattCliente, solicitarCpf, mostrarClientes, sendTelaBuscarCliente, deleteCliente,
    sendTelaExcluir2, addCliente, sendTelaExcluir, sendTelaCadCliente, sendTelaCrtlCliente, sendTelaErro,
    sendTelaSucesso, sendcss, sendlogo
}