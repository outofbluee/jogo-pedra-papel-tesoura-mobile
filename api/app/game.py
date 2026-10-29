import random


JOGADAS = ("pedra", "papel", "tesoura")


def sortear_jogada():
    return random.choice(JOGADAS)


def calcular_resultado(jogada_jogador, jogada_servidor):
    if jogada_jogador == jogada_servidor:
        return "empate"

    vitorias_jogador = {
        ("pedra", "tesoura"),
        ("papel", "pedra"),
        ("tesoura", "papel"),
    }

    if (jogada_jogador, jogada_servidor) in vitorias_jogador:
        return "vitoria"

    return "derrota"