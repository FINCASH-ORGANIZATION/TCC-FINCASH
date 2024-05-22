import rota from "../routes/auth.route.js";
import bcrypt from "bcrypt";
import { loginService, geradorToken } from "../services/auth.service.js";
import Usuario from "../models/Usuario.js";
import crypto from 'crypto';
import mailer from '../modules/mailer.js'
import { error } from "console";


const login = async (req, res) => {
    const { email, senha } = req.body;

    /* 
        Pesquisa no banco de dados para validar se a senha e o usuário estão corretos, caso algum deles esteja incorreto, é exibido a mensagem 
        de erro: "Usuario ou senha incorreto", se os dois estiverem corretos, ira exibir a mensagem dentro dos parenteses do "res.send()";
        Erro 404, neste caso é referente a uma mensagem automática do servidor, avisando que a página solicitada não foi encontrada.
    */
    try {
        const usuario = await loginService(email);

        if (!usuario) {
            return res.status(404).send({ Mensagem: "Usuario ou senha incorreto" });
        }

        const senhaisValid = bcrypt.compareSync(senha, usuario.senha);

        if (!senhaisValid) {
            return res.status(404).send({ Mensagem: "Usuario ou senha incorreto" });
        }

        const token = geradorToken(usuario.id);

        res.send({ token });
    }
    catch (error) {
        res.status(500).send(error.message); // Erro 500 significa que há um problema com alguma das bases do servidor
    }
}

const esqueceuSenha = async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await Usuario.findOne({ email })

        if (!usuario) {
            return res.status(404).send({ Mensagem: "Usuario incorreto" });
        }

        const senhatoken = crypto.randomBytes(20).toString('hex');

        const tempoExpiracao = new Date();
        tempoExpiracao.setHours(tempoExpiracao.getHours() + 1);

        console.log(senhatoken, tempoExpiracao);

        mailer.sendMail({
            to: email,
            from: 'henriquemartins7t@gmail.com',
            template: 'auth/esqueceu_senha',
            context: { senhaToken }
        }), (error) => {
            return res.status(400).send({ Mensagem: "não é possível enviar e-mail!" });
        }
        return res.status(200)
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

export { login, esqueceuSenha }; 