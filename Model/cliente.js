const sequelize = require('sequelize');

const db = require('../Persistence/db'); //importando a persistencia

const cliente = db.define('Cliente', (  //definindo cliente de acordo com os requisitoss
    {
        idPessoa: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nomePessoa: {
            type: sequelize.STRING,
            allowNull: false
        },
        CPF: {
            type: sequelize.STRING,
            allowNull: false,
            unique: true
        },
        Telefone: {
            type: sequelize.STRING,
            allowNull: false
        },
        Bairro: {
            type: sequelize.STRING,
            allowNull: false
        },
        Numero: {
            type: sequelize.INTEGER,
            allowNull: false
        },
        Logradouro: {
            type: sequelize.STRING,
            allowNull: false
        },
        Cidade: {
            type: sequelize.STRING,
            allowNull: false
        },
        tipoFuncionario: {
            type: sequelize.BOOLEAN,
            allowNull: false
        },
        tipoCliente: {
            type: sequelize.BOOLEAN,
            allowNull: false
        },
        Existente: {
            type: sequelize.BOOLEAN,
            allowNull: false
        }
    }
));

async function addCliente (result) {
    await db.sync();
    console.log("Entrou no add cliente de cliente.js");
    var retorno=false;
    await cliente.create({
        nomePessoa: result.nomePessoa,  //cria novo cliente com informacoes do fomulario
        CPF: result.CPF,
        Telefone: result.tel,
        Bairro: result.bairro,
        Numero: result.num,
        Logradouro: result.rua,
        Cidade: result.cid,
        tipoFuncionario: false,
        tipoCliente: true,
        Existente: true
    }).then(retorno = true ).catch( function (erro){ 
            console.log("Entrou no catch addcliente cliente.js");
            retorno =  false;
            console.log(retorno);
            return retorno;
    });
    console.log("retorno no final é " +retorno);
    return retorno;
}
 async function excluirCliente(idPessoa) {
    var retorno = false;
    await db.sync();
    try {
        let procura = await cliente.findByPk(idPessoa);
        procura.Existente= false;
        procura.save();
        retorno = true;
    } catch (erro) {
        throw new Error("erro");
    }
    return retorno;
};
async function attCliente(lastpkpessoa, req) {
    retorno = false;
    try{
        await db.sync;
        const procura = await cliente.findByPk(lastpkpessoa);
        procura.nomePessoa = req.body.nomePessoa;
        procura.CPF = req.body.CPF;
        procura.Cidade = req.body.cid;
        procura.Telefone = req.body.tel;
        procura.Bairro = req.body.bairro;
        procura.Logradouro = req.body.rua;
        procura.Numero = req.body.num;
        await procura.save();
        retorno = true;
    }catch(erro){
    }
    return retorno;
};
module.exports = { cliente, addCliente, excluirCliente, attCliente };