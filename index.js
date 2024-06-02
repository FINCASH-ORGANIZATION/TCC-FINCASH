import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./src/database/db.js";
import usuarioRota from "./src/routes/usuario.route.js";
import authRota from "./src/routes/auth.route.js";
import transacaoRota from "./src/routes/transacao.route.js";
import esqueceuSenhaRota from "./src/routes/esqueceuSenha.route.js";
import categoriaRota from "./src/routes/categoriaTransacao.route.js";
import cors from "./src/middlewares/cors.middlewares.js";

dotenv.config();
const rota = express.Router();

connectDatabase();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors);

app.use("/usuario", usuarioRota);
app.use("/auth", authRota);
app.use("/transacao", transacaoRota);
app.use("/senha", esqueceuSenhaRota);
app.use("/categoria", categoriaRota);

app.listen(port, () => {
    console.log(`A porta está aberta em: ${port}`)
});