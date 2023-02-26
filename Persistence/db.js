
const sequelize = require('sequelize'); //pede sequelize
const csequelize = new sequelize('banhoetosafacil','root', '123',{  //loga no sequelize
    dialect: 'mysql', host: 'localhost', port: 3306     //usa a configuraão
});

module.exports = csequelize;

