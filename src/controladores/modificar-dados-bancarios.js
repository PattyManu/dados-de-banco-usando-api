const { contas, banco } = require('../dados/banco-de-dados');
const bancoDeDados = require('../dados/banco-de-dados')

let numero = 0;


function criarContaBancaria(req, res) {
    numero++;

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(404).json(
            {
                "mensagem": "Preencha todos os campos!"
            }
        );
    }

    const cpfEncontrado = bancoDeDados.contas.find((cpfEncontrado) =>
        cpfEncontrado.usuario.cpf === cpf
    )
    if (cpfEncontrado) {
        return res.status(400).json(
            {
                "mensagem": "Já existe uma conta com o cpf informado!"
            }
        )
    }
    const emailEncontrado = bancoDeDados.contas.find((emailEncontrado) =>
        emailEncontrado.usuario.email === email
    )
    if (emailEncontrado) {
        return res.status(400).json(
            {
                "mensagem": "Já existe uma conta com o e-mail informado!"
            }
        )
    }
    const contaCadastrada =
    {
        numero: numero.toString(),
        saldo: 0,
        usuario: {
            nome: nome,
            cpf: cpf,
            data_nascimento: data_nascimento,
            telefone: telefone,
            email: email,
            senha: senha
        },
    }

    bancoDeDados.contas.push(contaCadastrada);

    return res.status(200).json(contaCadastrada);

}

function excluirContaBancaria(req, res) {
    const { saldo } = req.body
    const { numeroConta } = req.params


    if (bancoDeDados.contas[numeroConta] !== bancoDeDados.contas[numero]) {
        return res.status(404).json({
            "mensagem": "usuario nao encontrado"
        })
    }

    if (saldo < 0) {
        return res.status(400).json({
            "mensagem": "A conta só pode ser removida se o saldo for zero!"
        })
    }

    const indice = bancoDeDados.contas.findIndex((conta) => conta.numero === numeroConta);

    bancoDeDados.contas.splice(indice, 1);

}

function atualizarContaBancaria(req, res) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(404).json(
            {
                "mensagem": "Preencha todos os campos!"
            }
        );
    }

    const buscarCPF = bancoDeDados.contas.find(conta => {
        if (conta.numero !== conta.numero && conta.usuario.cpf === req.body.cpf) {
            return true
        }
    })

    const numeroConta = bancoDeDados.contas.find((conta) => {
        if (conta.numero === req.params.numeroConta) {
            return conta.numero
        }
    })

    const buscarEmail = bancoDeDados.contas.find(conta => {
        if (conta.numero !== conta.numero && conta.usuario.email === req.body.email) {
            return true
        }
    })


    if (!numeroConta) {
        return res.status(404).json({ "mensagem": `Conta número ${req.params.numeroConta} não existe.` });
    }
    if (buscarEmail) {
        return res.status(400).json({ "mensagem": 'E-mail já cadastrado.' });
    }
    if (buscarCPF) {
        return res.status(400).json({ "mensagem": 'CPF já cadastrado.' });
    }

    const conta = bancoDeDados.contas.find(conta => {
        if (conta.numero === req.params.numeroConta) {
            return conta
        }
    });
    console.log(conta);

    if (conta) {
        [
            conta.usuario.nome = nome,
            conta.usuario.cpf = cpf,
            conta.usuario.data_nascimento = data_nascimento,
            conta.usuario.telefone = telefone,
            conta.usuario.email = email,
            conta.senha = senha
        ]
    }



    return res.status(200).json(conta)
}

function consultarSaldoBancario(req, res) {
    const { numero, senha } = req.query;

    const conta = bancoDeDados.contas.find(conta => conta.numero === numero);

    if (!numero || !senha) {
        return res.status(400).json({ erro: 'Parâmetros insuficientes na URL da requisição' });
    }
    if (!conta) {
        return res.status(404).json({ "mensagem": "conta nao encontrada" });
    }
    if (conta.usuario.senha !== senha) {
        return res.status(404).json({ "mensagem": "Senha não corresponde a conta." });
    }

    return res.status(200).json(conta.saldo)

}

function listarContasBancaria(req, res) {
    if (req.query.senha_banco !== banco.senha) {
        return res.status(400).json(
            {
                "mensagem": "A senha do banco informado é inválida!"
            }
        )
    }
    return res.status(200).json(contas)
}

function emitirExtratoBancario(req, res) {
    const { senha, numero_conta } = req.params

    if (!senha && !numero_conta) {
        return res.status(400).json({
            "mensagem": "senha ou numero da conta nao informados!"
        })
    }

    const conta = bancoDeDados.contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta)
    });

    if (Number(conta.usuario.senha) !== Number(senha)) {
        return res.status(401).json({
            "mensagem": "senha incorreta!"
        })
    }

    const deposito = bancoDeDados.depositos.filter((dado) => {
        return dado.numero_conta === numero_conta
    });

    const saque = bancoDeDados.saques.filter((dado) => {
        return dado.numero_conta === numero_conta
    })

    const transferenciaEnviada = bancoDeDados.transferencias.filter((dado) => {
        return dado.numero_conta_origem === numero_conta
    })

    const transferenciasRecebidas = bancoDeDados.transferencias.filter((dado) => {
        return dado.numero_conta_destino === numero_conta
    })

    return res.status(200).json({
        saques: saque,
        depositos: deposito,
        transferenciasEnviadas: transferenciaEnviada,
        transferenciasRecebidas: transferenciasRecebidas
    })

}

module.exports = {
    criarContaBancaria,
    excluirContaBancaria,
    atualizarContaBancaria,
    consultarSaldoBancario,
    listarContasBancaria,
    emitirExtratoBancario
}