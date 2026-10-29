from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Annotated

from fastapi import FastAPI, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.database import inicializar_banco, listar_rodadas, salvar_rodada
from app.game import calcular_resultado, sortear_jogada
from app.schemas import JogadaEntrada, RodadaResposta


@asynccontextmanager
async def lifespan(app: FastAPI):
    inicializar_banco()
    yield


app = FastAPI(
    title="API - Pedra, Papel e Tesoura",
    description="API do jogo Pedra, Papel e Tesoura.",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/")
def inicio():
    return {"mensagem": "API do jogo funcionando!"}


@app.get("/saude")
def verificar_saude():
    return {"status": "ok"}


@app.post(
    "/rodadas",
    response_model=RodadaResposta,
    status_code=status.HTTP_201_CREATED,
)
def criar_rodada(dados: JogadaEntrada):
    jogada_jogador = dados.jogada
    jogada_servidor = sortear_jogada()
    resultado = calcular_resultado(jogada_jogador, jogada_servidor)

    criada_em = datetime.now(timezone.utc).isoformat()

    rodada = salvar_rodada(
        jogada_jogador=jogada_jogador,
        jogada_servidor=jogada_servidor,
        resultado=resultado,
        criada_em=criada_em,
    )

    return rodada


@app.get("/rodadas", response_model=list[RodadaResposta])
def obter_rodadas():
    return listar_rodadas()