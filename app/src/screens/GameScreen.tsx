import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { criarRodada, listarRodadas } from '../api';
import type { Jogada, Rodada } from '../api';
import { calcularPlacar } from '../score';
import type { Placar } from '../score';

type GameScreenProps = {
  aoAbrirHistorico: () => void;
};

export default function GameScreen({
  aoAbrirHistorico,
}: GameScreenProps) {
  const [rodada, setRodada] = React.useState<Rodada | null>(null);
  const [jogando, setJogando] = React.useState(false);
  const [mensagem, setMensagem] = React.useState('');

  const [placar, setPlacar] = React.useState<Placar | null>(null);
  const [carregandoPlacar, setCarregandoPlacar] = React.useState(true);
  const [erroPlacar, setErroPlacar] = React.useState('');

  async function atualizarPlacar() {
    setCarregandoPlacar(true);
    setErroPlacar('');

    try {
      const rodadas = await listarRodadas();
      const novoPlacar = calcularPlacar(rodadas);

      setPlacar(novoPlacar);
    } catch (erro) {
      setErroPlacar(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível atualizar o placar.',
      );
    } finally {
      setCarregandoPlacar(false);
    }
  }

  React.useEffect(() => {
    atualizarPlacar();
  }, []);

  async function jogar(jogada: Jogada) {
    if (jogando) {
      return;
    }

    setJogando(true);
    setMensagem('');

    try {
      const novaRodada = await criarRodada(jogada);

      // O servidor confirmou a partida e devolveu os dados esperados.
      setRodada(novaRodada);

      try {
        const rodadas = await listarRodadas();
        const novoPlacar = calcularPlacar(rodadas);

        setPlacar(novoPlacar);
        setErroPlacar('');
      } catch (erro) {
        setErroPlacar(
          erro instanceof Error
            ? erro.message
            : 'Não foi possível atualizar o placar.',
        );

        setMensagem(
          'Partida confirmada, mas não foi possível atualizar o placar. ' +
            'O resultado foi preservado.',
        );
      }
    } catch (erro) {
      setMensagem(
        erro instanceof Error
          ? `${erro.message} Não repita a jogada automaticamente. ` +
              'Consulte o histórico para verificar se ela foi registrada.'
          : 'Não foi possível confirmar a jogada. Consulte o histórico antes de jogar novamente.',
      );
    } finally {
      setJogando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <View style={styles.scoreboard}>
          <Text style={styles.scoreTitle}>Placar</Text>

          {carregandoPlacar && placar === null ? (
            <Text style={styles.scoreMessage}>Carregando placar...</Text>
          ) : placar === null ? (
            <Text style={styles.scoreMessage}>
              Placar indisponível. Verifique sua conexão.
            </Text>
          ) : (
            <View style={styles.scoreRow}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreNumber}>{placar.vitorias}</Text>
                <Text style={styles.scoreLabel}>Vitórias</Text>
              </View>

              <View style={styles.scoreItem}>
                <Text style={styles.scoreNumber}>{placar.empates}</Text>
                <Text style={styles.scoreLabel}>Empates</Text>
              </View>

              <View style={styles.scoreItem}>
                <Text style={styles.scoreNumber}>{placar.derrotas}</Text>
                <Text style={styles.scoreLabel}>Derrotas</Text>
              </View>
            </View>
          )}

          {erroPlacar !== '' && placar !== null && (
            <Text style={styles.scoreMessage}>
              Não foi possível atualizar o placar: {erroPlacar}
            </Text>
          )}

          {!carregandoPlacar && erroPlacar !== '' && (
            <TouchableOpacity
              onPress={atualizarPlacar}
              accessibilityRole="button"
            >
              <Text style={styles.scoreRetry}>Atualizar placar</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.title}>Pedra, Papel e Tesoura</Text>

        <Text style={styles.subtitle}>
          Escolha sua jogada e desafie o servidor!
        </Text>

        <View style={styles.gameArea}>
          <Text style={styles.sectionTitle}>Resultado da partida</Text>

          {jogando ? (
            <Text style={styles.result}>Enviando jogada...</Text>
          ) : rodada ? (
            <View>
              <Text style={styles.result}>
                Você jogou: {rodada.jogada_jogador}
              </Text>

              <Text style={styles.result}>
                Servidor jogou: {rodada.jogada_servidor}
              </Text>

              <Text style={styles.result}>
                Resultado: {rodada.resultado}
              </Text>
            </View>
          ) : (
            <Text style={styles.result}>
              Escolha pedra, papel ou tesoura.
            </Text>
          )}

          {mensagem !== '' && (
            <Text style={styles.error}>{mensagem}</Text>
          )}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, jogando && styles.buttonDisabled]}
            onPress={() => jogar('pedra')}
            disabled={jogando}
            accessibilityRole="button"
            accessibilityLabel="Jogar pedra"
          >
            <Text style={styles.buttonText}>✊ Pedra</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, jogando && styles.buttonDisabled]}
            onPress={() => jogar('papel')}
            disabled={jogando}
            accessibilityRole="button"
            accessibilityLabel="Jogar papel"
          >
            <Text style={styles.buttonText}>✋ Papel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, jogando && styles.buttonDisabled]}
            onPress={() => jogar('tesoura')}
            disabled={jogando}
            accessibilityRole="button"
            accessibilityLabel="Jogar tesoura"
          >
            <Text style={styles.buttonText}>✌️ Tesoura</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={aoAbrirHistorico}
          accessibilityRole="button"
        >
          <Text style={styles.historyButtonText}>Ver histórico</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748B',
    marginBottom: 32,
  },
  gameArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  result: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    marginVertical: 4,
  },
  error: {
    color: '#B91C1C',
    textAlign: 'center',
    marginTop: 12,
  },
  buttons: {
    gap: 12,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2563EB',
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreboard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 16,
  marginBottom: 24,
  elevation: 2,
},
scoreTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#1E293B',
  textAlign: 'center',
  marginBottom: 12,
},
scoreRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
},
scoreItem: {
  alignItems: 'center',
  flex: 1,
},
scoreNumber: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#2563EB',
},
scoreLabel: {
  fontSize: 13,
  color: '#64748B',
  marginTop: 4,
},
scoreMessage: {
  color: '#64748B',
  textAlign: 'center',
  marginTop: 8,
},
scoreRetry: {
  color: '#2563EB',
  textAlign: 'center',
  fontWeight: 'bold',
  marginTop: 12,
},
});
