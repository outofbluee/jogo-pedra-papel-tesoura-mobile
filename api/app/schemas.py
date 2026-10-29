from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


Jogada = Literal["pedra", "papel", "tesoura"]
Resultado = Literal["vitoria", "derrota", "empate"]


class JogadaEntrada(BaseModel):
    model_config = ConfigDict(extra="forbid")

    jogada: Jogada


class RodadaResposta(BaseModel):
    id: int
    jogada_jogador: Jogada
    jogada_servidor: Jogada
    resultado: Resultado
    criada_em: datetime