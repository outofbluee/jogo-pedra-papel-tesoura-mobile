import sqlite3
from pathlib import Path

CAMINHO_BANCO = Path(__file__).resolve().parent.parent / "jogo.db"


def conectar():
    conexao = sqlite3.connect(CAMINHO_BANCO, timeout=10)
    conexao.row_factory = sqlite3.Row
    return conexao


def inicializar_banco():
    with conectar() as conexao:
        conexao.execute(
            """
            CREATE TABLE IF NOT EXISTS rodadas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                jogada_jogador TEXT NOT NULL,
                jogada_servidor TEXT NOT NULL,
                resultado TEXT NOT NULL,
                criada_em TEXT NOT NULL
            )
            """
        )


def salvar_rodada(jogada_jogador, jogada_servidor, resultado, criada_em):
    with conectar() as conexao:
        cursor = conexao.execute(
            """
            INSERT INTO rodadas (
                jogada_jogador,
                jogada_servidor,
                resultado,
                criada_em
            )
            VALUES (?, ?, ?, ?)
            """,
            (jogada_jogador, jogada_servidor, resultado, criada_em),
        )

        rodada_id = cursor.lastrowid

        linha = conexao.execute(
            "SELECT * FROM rodadas WHERE id = ?",
            (rodada_id,),
        ).fetchone()

        return dict(linha)


def listar_rodadas():
    with conectar() as conexao:
        linhas = conexao.execute(
            "SELECT * FROM rodadas ORDER BY id DESC"
        ).fetchall()

        return [dict(linha) for linha in linhas]