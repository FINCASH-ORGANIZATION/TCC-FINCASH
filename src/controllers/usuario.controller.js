import {
    criarUsuService,
    pesUsuService,
    pesUsuIdService,
    atualizarUsuService,
    deletarUsuService
} from "../services/Usuario.service.js";

export const criarUsu = async (req, res) => {
    try {
        const { nome, senha, email, telefone, avatar } = req.body;
        const Usuario = await criarUsuService(req.body)

        //      FAZ A SELEÇÃO DOS DADOS INSERIDOS, VENDO SE REALMENTE FORAM TODOS PREENCHIDOS CORRETAMENTE;
        //      Erro 400, quando um campo não pode ser processado pelo servidor, erro de digitação do usuário
        if (!nome || !senha || !email) {
            res.status(400).json({ message: "Por favor, preencha todos os campos para se registrar!" })
        };

        //      DEVOLVE A MENSAGEM DE ERRO E STATUS PARA O BANCO E USUARIO
        if (!Usuario) {
            return res.status(400).send({ message: "Erro na criação do usuario" });
        };
        //      DEVOLVE PARA O USUARIO A RESPOSTA COM OS DADOS INSERIDOS E SE FOI REALMENTE CRIADO
        res.status(201).json({
            Mensagem: "Usuario cadastrado com sucesso!",
            Usuario: {
                id: Usuario._id,
                nome,
                email,
                senha,
                telefone,
                avatar
            },
        });
    } catch (error) {
        res.status(400).send(error.message);
    };
};

export const pesUsu = async (req, res) => {
    try {
        const Usuarios = await pesUsuService();

        if (Usuarios.length === 0) {
            return res.status(400).send({ mensagem: "Não há usuarios cadastrados" })
        };

        res.send(Usuarios);

    } catch (error) {
        res.status(500).send({ message: error.message });
    };
};

// Função de verificação e pesquisa de usuário pelo Id
export const pesUsuId = async (req, res) => {

    const UsuarioId = req.Usuario; // Faz a requisição do Usuario para o banco de dados

    res.send(UsuarioId); // Faz a Requisição do Usuario ao banco de dados e retorna ao usuario a exibição do nome, email e afins

};

export const UsuUpdate = async (req, res) => {
    try {
        const { id, Usuario } = req;
        const { nome, senha, email, telefone, avatar } = req.body;

        if (!nome && !senha && !email && !telefone && !avatar) {
            return res.status(400).json({ mensagem: "Preencha pelo menos um campo para fazer a alteração!" });
        };

        const usuarioAtualizado = {
            nome: nome || Usuario.nome,
            senha: senha || Usuario.senha,
            email: email || Usuario.email,
            telefone: telefone || Usuario.telefone,
            avatar: avatar || Usuario.avatar
        };

        if (
            usuarioAtualizado.nome === Usuario.nome &&
            usuarioAtualizado.senha === Usuario.senha &&
            usuarioAtualizado.email === Usuario.email &&
            usuarioAtualizado.telefone === Usuario.telefone &&
            usuarioAtualizado.avatar === Usuario.avatar
        ) {
            return res.status(400).json({ mensagem: "Você precisa fazer alguma alteração para atualizar os dados!" });
        };

        await atualizarUsuService(
            id,
            usuarioAtualizado.nome,
            usuarioAtualizado.senha,
            usuarioAtualizado.email,
            usuarioAtualizado.telefone,
            usuarioAtualizado.avatar
        );

        res.send({ mensagem: "Usuario alterado com sucesso" });

    } catch (error) {
        res.status(500).send({ message: error.message });
    };
};

export const deletarUsu = async (req, res) => {
    try {
        const { id } = req.params;

        // Chamada para buscar o usuário pelo ID
        const Usuario = await pesUsuIdService(id);

        // Verifica se o usuário existe
        if (!Usuario) {
            return res.status(400).send({ mensagem: "Usuário não encontrado" });
        }

        // Verifica se o usuário que está tentando deletar a conta é o mesmo que a criou
        if (Usuario._id.toString() !== req.Usuario._id.toString()) {
            return res.status(403).send({ mensagem: 'Você não pode deletar esse usuário!' });
        }

        // Deleta o usuário
        await deletarUsuService(id);

        return res.status(200).send({ mensagem: "Usuário deletado com sucesso!" });

    } catch (error) {
        res.status(500).send({ mensagem: error.message });
    }
};
