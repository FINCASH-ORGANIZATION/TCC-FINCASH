import {
    criarTransacaoRota,
    pesTransacaoRota,
    pesquisaIDRota,
    pesDescricaoRota,
    pesDescricaoRotaId,
    pesUsuarioRota,
    atualizarTrans,
    deletarTrans
} from "../controllers/transacao.controller.js";
import { authMiddlewares } from "../middlewares/auth.middlewares.js";
import { saldomiddleware } from "../middlewares/saldo.middleware.js";
import { Router } from "express";

const rota = Router();

rota.post("/", authMiddlewares, criarTransacaoRota, saldomiddleware);
rota.get("/", pesTransacaoRota, saldomiddleware);
rota.get("/pesquisar", authMiddlewares, pesDescricaoRota);
rota.get("/descricao-id", authMiddlewares, pesDescricaoRotaId)
rota.get("/pesUsuarioRota", authMiddlewares, pesUsuarioRota);
rota.get("/:id", pesquisaIDRota);
rota.patch("/:id", authMiddlewares, atualizarTrans, saldomiddleware)
rota.delete("/:id", authMiddlewares, deletarTrans, saldomiddleware);

export default rota;    