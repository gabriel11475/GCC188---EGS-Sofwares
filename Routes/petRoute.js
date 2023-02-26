const express = require('express');
const petcrtl = require("../Controller/petController");


const router=express.Router();

router.get('/style.css', petcrtl.sendcss)
router.get('/imagens/logo.jpg', petcrtl.sendlogo)
// CLIENTES
router.get('/view/tela_sucesso.html', petcrtl.sendTelaSucesso)

router.get("/view/tela_erro.html", petcrtl.sendTelaErro)

router.get('/view/controle_pet.html', petcrtl.sendTelaPet)
router.get('/', clientecrtl.sendTelaCrtlCliente)
//router.post('/view/controle_cliente.html', clientecrtl.sendTelaCrtlCliente)

router.get("/cadastrar_pet.html", petcrtl.sendTelaPet)

router.post('/addpet', petcrtl.addPet)

router.get('/excluir_pet.html', petcrtl.sendTelaExcluir)

router.post('/excluipetePorCpf', petcrtl.sendTelaExcluir2)

router.post('/deletePet', petcrtl.deletePet)  

router.get('/pagina_buscar_pet.html', petcrtl.sendTelaBuscarPet)

router.post('/exibirPet', petcrtl.mostrarClientes)


router.get('/solicitar_cpf_e_nome.html', petcrtl.solicitarCpfENome)

router.post('/atualizar_pet.ejs', pettecrtl.formattPet)

router.post('/attPet', petcrtl.attPet )

module.exports = router