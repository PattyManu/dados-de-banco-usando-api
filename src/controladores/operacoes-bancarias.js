const { transferencias } = require('../dados/banco-de-dados');
const bancoDeDados = require('../dados/banco-de-dados');
const { criarContaBancaria } = require('./modificar-dados-bancarios');
const { format } = require('date-fns')

function depositoBancario(req, res) {
    const { numero_conta, valor } = req.body;

    const conta = bancoDeDados.contas.find((conta) =>
        conta.numero === numero_conta
    )
    if (!conta) {
        return res.status(400).json({
            "mensagem": "Conta invalida!"
        })
    }

    if (valor <= 0) {
        return res.status(400).json({
            "mensagem": "Valor invalido!"
        })
    }

    const indice = bancoDeDados.contas.indexOf(conta);
    bancoDeDados.contas[indice].saldo += valor;

    const depositar = {
        data: new Date(),
        numero_conta: numero_conta,
        valor: valor,
    }

    bancoDeDados.depositos.push(depositar);

    return res.status(204).json({

    });

};

function saqueBancario(req, res) {

    const { numero_conta, valor, senha } = req.body


    if (!numero_conta && !valor && !senha) {
        return res.status(400).json(
            {
                "mensagem": "Preencha todos os dados!"
            }
        )
    }

    if (valor <= 0) {
        return res.status(400).json(
            {
                "mensagem": "O valor da conta deve ser maior que 0(zero)!"
            })
    }

    let numeroConta = bancoDeDados.contas.find((numeroConta) =>
        numeroConta.numero === numero_conta
    )

    if (!numeroConta) {
        return res.status(400).json(
            {
                "mensagem": " Conta nao encontrada!"
            }
        )
    } else {
        const indice = bancoDeDados.contas.indexOf(numeroConta);

        if (bancoDeDados.contas[indice].usuario.senha === senha) {
            if (bancoDeDados.contas[indice].saldo <= 0) {
                return res.status(400).json({
                    "mensagem": "saldo insuficiente"
                })
            } else {
                bancoDeDados.contas[indice].saldo -= valor;
                const saques = {
                    data: new Date(),
                    numero_conta: numero_conta,
                    valor: valor,
                }

                bancoDeDados.saques.push(saques);

                return res.status(204).json({});
            }
        } else {
            return res.status(404).json({
                "mensagem": "Dados incorretos!"
            })
        }
    }
};

function transferenciaBancario(req, res) {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_destino && !numero_conta_origem && !valor && !senha) {
        return res.status(400).json({
            "mensagem": "preencha todos os campos obrigatorios!"
        })
    }

    const contaBancariaDeOrigem = bancoDeDados.contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta_origem)
    })

    if (!contaBancariaDeOrigem) {
        return res.status(404).json({
            "mensagem": "conta de origem nao encontrada!"
        })
    }

    const contaBancariaDeDestino = bancoDeDados.contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta_destino)
    })

    if (!contaBancariaDeDestino) {
        return res.status(404).json({
            "mensagem": "conta de destino nao encontrada!"
        })
    }

    if (contaBancariaDeOrigem.usuario.senha !== senha) {
        return res.status(401).json({
            "mensagem": "senha incorreta!"
        })
    }
    if (Number(contaBancariaDeOrigem.usuario.saldo) < Number(valor)) {
        return res.status(400).json({
            "mensagem": `O saldo precisa ser maior que ${valor}`
        })
    }

    contaBancariaDeOrigem.usuario.saldo -= valor;
    contaBancariaDeDestino.usuario.saldo += valor;

    const novaTransferencia = {
        data: new Date(),
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino,
        valor: valor
    }

    bancoDeDados.transferencias.push(novaTransferencia)

    return res.status(200).json(novaTransferencia)

};

module.exports = {
    depositoBancario,
    saqueBancario,
    transferenciaBancario
}