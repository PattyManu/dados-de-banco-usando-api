const express = require('express');
const { criarContaBancaria,
    excluirContaBancaria,
    atualizarContaBancaria,
    consultarSaldoBancario,
    listarContasBancaria,
    emitirExtratoBancario } = require('../controladores/modificar-dados-bancarios');
const { depositoBancario,
    saqueBancario,
    transferenciaBancario } = require('../controladores/operacoes-bancarias');

const roteador = express();

roteador.post('/contas', criarContaBancaria);//
roteador.delete('/contas/:numeroConta', excluirContaBancaria);//
roteador.put('/contas/:numeroConta/usuario', atualizarContaBancaria);//
roteador.get('/contas/saldo', consultarSaldoBancario);//
roteador.get('/contas', listarContasBancaria);//
roteador.get('/contas/extrato/:numero_conta/:senha', emitirExtratoBancario);
roteador.post('/transacoes/depositar', depositoBancario);//
roteador.post('/transacoes/sacar', saqueBancario);//
roteador.post('/transacoes/transferir', transferenciaBancario);

module.exports = roteador