import { API_URL } from './config';

async function fetchComTimeout(
  url: string,
  opcoes: RequestInit = {},
  timeoutMs = 15_000,
): Promise<Response> {
  const controller = new AbortController();

  const temporizador = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(url, {
      ...opcoes,
      signal: controller.signal,
    });
  } catch (erro) {
    if (controller.signal.aborted) {
      throw new Error(
        'A requisição excedeu o tempo limite de 15 segundos.',
      );
    }

    throw new Error(
      'Não foi possível se comunicar com o servidor. Verifique a conexão.',
    );
  } finally {
    clearTimeout(temporizador);
  }
}

export async function testarConexao(): Promise<string> {
  const resposta = await fetchComTimeout(`${API_URL}/saude`);

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
  const resposta = await fetchComTimeout(`${API_URL}/rodadas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ jogada }),
  });

  if (resposta.status !== 201) {
    throw new Error(
      `A API respondeu com HTTP ${resposta.status}.`,
    );
  }

  let dados: unknown;

  try {
    dados = await resposta.json();
  } catch {
    throw new Error(
      'A API confirmou a criação, mas retornou uma resposta inválida.',
    );
  }

  if (
    typeof dados !== 'object' ||
    dados === null ||
    !('id' in dados) ||
    !('jogada_jogador' in dados) ||
    !('jogada_servidor' in dados) ||
    !('resultado' in dados) ||
    !('criada_em' in dados)
  ) {
    throw new Error(
      'A API retornou dados incompletos para a partida.',
    );
  }

  const rodada = dados as Rodada;

  const jogadasValidas: Jogada[] = ['pedra', 'papel', 'tesoura'];
  const resultadosValidos = ['vitoria', 'derrota', 'empate'];

  if (
    typeof rodada.id !== 'number' ||
    !Number.isInteger(rodada.id) ||
    rodada.id <= 0 ||
    rodada.jogada_jogador !== jogada ||
    !jogadasValidas.includes(rodada.jogada_servidor) ||
    !resultadosValidos.includes(rodada.resultado) ||
    typeof rodada.criada_em !== 'string' ||
    Number.isNaN(Date.parse(rodada.criada_em))
  ) {
    throw new Error(
      'A API retornou dados inválidos para a partida.',
    );
  }

  return rodada;
}

export async function listarRodadas(): Promise<Rodada[]> {
  const resposta = await fetchComTimeout(`${API_URL}/rodadas`);

  if (!resposta.ok) {
    throw new Error(`A API respondeu com HTTP ${resposta.status}.`);
  }

  const rodadas: Rodada[] = await resposta.json();

  if (!Array.isArray(rodadas)) {
    throw new Error('A API retornou um histórico inválido.');
  }

  return rodadas;
}