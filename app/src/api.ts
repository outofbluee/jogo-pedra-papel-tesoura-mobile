import { API_URL } from './config';

export async function testarConexao(): Promise<string> {
  const resposta = await fetch(`${API_URL}/saude`);

  if (!resposta.ok) {
    throw new Error(`A API respondeu com HTTP ${resposta.status}.`);
  }

  const dados: { status: string } = await resposta.json();

  return dados.status;
}

export type Jogada = 'pedra' | 'papel' | 'tesoura';

export type Rodada = {
  id: number;
  jogada_jogador: Jogada;
  jogada_servidor: Jogada;
  resultado: 'vitoria' | 'derrota' | 'empate';
  criada_em: string;
};

export async function criarRodada(jogada: Jogada): Promise<Rodada> {
  const resposta = await fetch(`${API_URL}/rodadas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ jogada }),
  });

  if (!resposta.ok) {
    throw new Error(`A API respondeu com HTTP ${resposta.status}.`);
  }

  const rodada: Rodada = await resposta.json();

  return rodada;
}

export async function listarRodadas(): Promise<Rodada[]> {
  const resposta = await fetch(`${API_URL}/rodadas`);

  if (!resposta.ok) {
    throw new Error(`A API respondeu com HTTP ${resposta.status}.`);
  }

  const rodadas: Rodada[] = await resposta.json();

  if (!Array.isArray(rodadas)) {
    throw new Error('A API retornou um histórico inválido.');
  }

  return rodadas;
}