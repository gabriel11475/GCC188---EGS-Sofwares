const sequelize = require('sequelize');
const cliente = require('../src/Model/cliente'); 

const db = require('../Persistence/db'); //importando a persistencia

const pet = db.define('Pet', {
    idPet: { 
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }, 
    idPessoa: {
        type: sequelize.INTEGER,
        references: {
            model: clientes,
            key: idPessoa
        },
        allowNull:false
    },
    nomePet: {
        type: sequelize.STRING,
        allowNull: false
    },
    Especie: {
        type: sequelize.STRING,
        allowNull: false,
    },
    Raca: {
        type: sequelize.STRING,
        allowNull: true
    },
    Peso: {
        type: sequelize.DOUBLE,
        allowNull: true
    },
    Existente: {
        type: sequelize.BOOLEAN,
        allowNull:false
    }
})
pet.belongsTo(cliente);
cliente.hasMany(pet);

async function addPet (result) {
    await db.sync();
    console.log("Entrou no add cliente de cliente.js");
    var retorno=false;
    const pessoa = cliente.cliente.findAll( { where: { CPF: result.CPF }})[0];
    await pet.create({
        nomePet: result.nomePet,  //cria novo cliente com informacoes do fomulario
        Especie: result.especie,
        Peso: result.peso,
        Raca: result.raca,
        Existente: true,
        idPessoa: pessoa.idPessoa
    }).then(retorno = true )
    .catch( function (erro){ 
            console.log("Entrou no catch addpet pet.js");
            retorno =  false;
            console.log(retorno);
            return retorno;
    });
    console.log("retorno no final é " +retorno);
    return retorno;
}
 async function excluirPet(idPet) {
    var retorno = false;
    await db.sync();
    try {
        let procura = await pet.findByPk(idPet);
        procura.Existente=false;
        await procura.save();
        retorno = true;
    } catch (erro) {
        throw new Error("erro");
    }
    return retorno;
};
async function attPet(pkpet, req) {
    retorno = false;
    try{
        await db.sync;
        const procura = await pet.findByPk(pkpet);
        procura.nomePet= req.nomePet,  //cria novo cliente com informacoes do fomulario
        procura.Especie= req.especie,
        procura.Peso= req.peso,
        procura.Raca= req.raca,
        await procura.save();
        retorno = true;
    }catch(erro){
    }
    return retorno;
};