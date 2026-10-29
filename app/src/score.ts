import type { Rodada } from './api';

export type Placar = {
  vitorias: number;
  empates: number;
  derrotas: number;
};

export function calcularPlacar(rodadas: Rodada[]): Placar {
  return rodadas.reduce(
    (placar, rodada) => {
      switch (rodada.resultado) {
        case 'vitoria':
          placar.vitorias += 1;
          break;

        case 'empate':
          placar.empates += 1;
          break;

        case 'derrota':
          placar.derrotas += 1;
          break;
      }

      return placar;
    },
    {
      vitorias: 0,
      empates: 0,
      derrotas: 0,
    },
  );
}