import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { listarRodadas } from '../api';
import type { Rodada } from '../api';

type HistoryScreenProps = {
  aoVoltar: () => void;
};

export default function HistoryScreen({
  aoVoltar,
}: HistoryScreenProps) {
  const [rodadas, setRodadas] = React.useState<Rodada[]>([]);
  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState('');

  async function carregarHistorico() {
    setCarregando(true);
    setErro('');

    try {
      const dados = await listarRodadas();
      setRodadas(dados);
    } catch (problema) {
      setErro(
        problema instanceof Error
          ? problema.message
          : 'Não foi possível carregar o histórico.',
      );
    } finally {
      setCarregando(false);
    }
  }

  React.useEffect(() => {
    carregarHistorico();
  }, []);

  function formatarData(dataIso: string): string {
    const data = new Date(dataIso);

    if (Number.isNaN(data.getTime())) {
      return dataIso;
    }

    return data.toLocaleString('pt-BR');
  }

  function formatarResultado(resultado: Rodada['resultado']): string {
    switch (resultado) {
      case 'vitoria':
        return 'Vitória';
      case 'derrota':
        return 'Derrota';
      case 'empate':
        return 'Empate';
      default:
        return resultado;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Histórico de partidas</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={aoVoltar}
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>Voltar ao jogo</Text>
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.info}>Carregando histórico...</Text>
        </View>
      ) : erro !== '' ? (
        <View style={styles.center}>
          <Text style={styles.error}>
            Não foi possível carregar o histórico.
          </Text>

          <Text style={styles.info}>{erro}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={carregarHistorico}
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : rodadas.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.info}>
            Ainda não há partidas no histórico.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {rodadas.map(rodada => (
            <View key={rodada.id} style={styles.card}>
              <Text style={styles.roundTitle}>
                Partida #{rodada.id}
              </Text>

              <Text style={styles.detail}>
                Você: {rodada.jogada_jogador}
              </Text>

              <Text style={styles.detail}>
                Servidor: {rodada.jogada_servidor}
              </Text>

              <Text style={styles.result}>
                Resultado: {formatarResultado(rodada.resultado)}
              </Text>

              <Text style={styles.date}>
                {formatarData(rodada.criada_em)}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  backButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  info: {
    color: '#64748B',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  error: {
    color: '#B91C1C',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  roundTitle: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    color: '#334155',
    fontSize: 16,
    marginTop: 4,
  },
  result: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  date: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 10,
  },
});
