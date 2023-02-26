const express = require('express'); //importando modulos necesarios
const bp = require('body-parser');
const morgan = require('morgan');
const seq = require('sequelize');
const path = require('path');
const ejs = require('ejs');
console.log("req bd")
const db = require('../Persistence/db');
const cliente = require('../Model/cliente'); 
const addCliente= require('../Model/cliente').addCliente;
const res = require('express/lib/response');

var user = null;

// criar serviço
const app = express();      //instancia srver
app.set("views", path.join(__dirname, 'views'));    //para usarr o ejs
app.set('view engine', 'ejs');

//configurando morgan
app.use(morgan('dev'));
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());


//enviando arquivos
app.get('/styleLogin.css', (req, res) => {
    res.sendFile('/view/styleLogin.css', { root: '..' });
})
app.get('/style.css', (req, res) => {
    res.sendFile('/view/style.css', { root: '..' });
})
app.get('/view/style.css', (req, res) => {
    res.sendFile('/view/style.css', { root: '..' });
})

app.get('/imagens/logo.jpg', (req, res) => {
    res.sendFile('/view/imagens/logo.jpg', { root: '..' });
})
app.get('/view/imagens/logo.jpg', (req, res) => {
    res.sendFile('/view/imagens/logo.jpg', { root: '..' });
})

//começa na tela de login
app.get('/', (req, res) => {        //inicia login
    console.log("Enviando login.");
    res.sendFile('/view/login.html', { root: '..' });
})

//faz verificacao de usuario
app.post('/login', (req, res) => {
    console.log("entrou login");
    const result = req.body;
    console.log(result);
    if (result.login == 'admin' && result.senha == 'admin') {   //user aadmin admin
        user = 'admin';
        res.redirect('/view/Gerenciamento.html');
    } else {
        res.send("Usuario nao cadastrado");
    }
})

app.get('/view/Gerenciamento.html', (req, res) => {         //tela principal
    res.sendFile('/view/Gerenciamento.html', { root: '..' });
})

app.get('/view/tela_sucesso.html', (req, res) => {      //tela de sucesso
    res.sendFile('/view/tela_sucesso.html', { root: '..' });
})
app.get("/view/tela_erro.html", (req, res) => {        //tela de erro
    res.sendFile('/view/tela_erro.html', { root: '..' });
})
app.get('/view/controle_cliente.html', (req, res) => {     //tela do crud de cliente
    res.sendFile('/view/controle_cliente.html', { root: '..' });
    console.log("entrou controle");
})
app.post('/view/controle_cliente.html', (req, res) => {     //tela do crud de cliente
    res.sendFile('/view/controle_cliente.html', { root: '..' });
    console.log("entrou post controle");
})
app.get('/view/cadastrar_clientes.html', (req, res) => {   //cadastrando clientes
    res.sendFile('/view/cadastrar_clientes.html', { root: '..' });  //envia formulario
    console.log("entrou cadastrar_cliente");
})

app.post('/view/addCliente', async (req, res) => {
    console.log("entrou add cliente");
    const result = req.body;
    console.log(result);
    if (result != null) {

        //CODIGO ANTIGO
        /*await db.sync();
        await cliente.create({
            nomePessoa: result.nomePessoa,  //cria novo cliente com informacoes do fomulario
            CPF: result.CPF,
            Telefone: result.tel,
            Bairro: result.bairro,
            Numero: result.num,
            Logradouro: result.rua,
            Cidade: result.cid,
            tipoFuncionario: 0,
            tipoCliente: 1
        }).then(function () {
            //res.send(req.body.nome + req.body.cpf + "Cadastraddo");   
            console.log("Entrou no then");
            res.redirect('/view/tela_sucesso.html');  //se deu certo
        }).catch(function (erro) {
            res.redirect("/view/tela_erro.html");  //se deu erro
        });*/


        try{
            cliente.addCliente(result);
        }catch(erro){
            console.log("entrou no catch add cliente app.js");
            res.redirect('/view/tela_erro.html'); 
        }
        res.redirect('/view/tela_sucesso.html'); 
    }
})

app.get('/view/excluir_cliente.html', (req, res) => {
    res.sendFile('/view/excluir_cliente.html', { root: '..' });
    console.log("entrou no excluir cliente");
})
var lastpkpessoa = -1;
app.post('/view/excluirClientePorCpf', async (req, res) => {
    /*await db.sync();
    await cliente.destroy({
        where: { CPF: req.body.CPF }     //exclui cliente de cpf = ao cpf do formulario
    }).then(function () {
        res.redirect("/view/tela_sucesso.html"); ''
    }).catch(function (erro) {
        res.redirect("/view/tela_erro.html");
    })*/
    clientefordelete= await cliente.cliente.findAll( { where: {CPF: req.body.CPF }});
    lastpkpessoa= clientefordelete.idPessoa;
    console.log(clientefordelete);
    console.log(clientefordelete[0]);
    res.render('../../view/mostrar_cliente', {cliente: clientefordelete[0] });
})
app.post('/deleteCliente', (req, res) =>{
    try {
        cliente.excluirCliente(req.body.pkpessoa);
        lastpkpessoa=-1;
        res.redirect("/view/tela_sucesso.html");
    } catch (error) {
        res.redirect("/view/tela_erro.html");
    }
})  

app.get('/view/pagina_buscar_cliente.html', (req, res) => {
    res.sendFile('/view/pagina_buscar_cliente.html', { root: '..' });  //pega nome de cliente no form
})
app.post('/view/exibirCliente', async (req, res) => {
    var procura = null;
    try {
        await db.sync;
        console.log("Entrou no exibirCliente");
        procura = await cliente.cliente.findAll({ where: { nomePessoa: req.body.nomePessoa } }); //faz select
    } catch (err) {
        res.redirect('/view/tela_erro.html');
    }
    console.log(procura);
    if (procura != null) {
        res.render("../../view/informacoes_cliente", { pessoas: procura }); //exibe clientes com o nome
    }
})


app.get('/view/solicitar_cpf.html', (req, res) => {
    res.sendFile('/view/solicitar_cpf.html', { root: '..' })  //solicita cpf
})

app.post('/view/atualizar_cliente.ejs', async (req, res) => {
    const procura = await cliente.cliente.findAll({ where: { CPF: req.body.CPF } });
    console.log(procura);
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
    res.render("../../view/atualizar_cliente", { pessoa: pessoa });//gera formulario preenchido
})
app.post('/attCliente', async (req, res) => {
    /*await db.sync;
    const procura = await cliente.findByPk(lastpkpessoa);
    lastpkpessoa = -1;
    console.log(procura);
    procura.nomePessoa = req.body.nomePessoa;
    procura.CPF = req.body.CPF;
    procura.Cidade = req.body.cid;
    procura.Telefone = req.body.tel;
    procura.Bairro = req.body.bairro;
    procura.Logradouro = req.body.rua;
    procura.Numero = req.body.num;
    await procura.save().then(function () {   //atualiza o que foi modificado
        res.redirect("view/tela_sucesso.html");
    }).catch(function (erro) {
        res.redirect("view/tela_erro.html");
    })*/
    try {
        cliente.attCliente(lastpkpessoa, req);
        res.redirect("view/tela_sucesso.html");
    } catch (error) {
        res.redirect("view/tela_erro.html");
    }
        
})

console.log("Server inicializado");
app.listen(5000, () => console.log("ouvindo porta 5000"));
