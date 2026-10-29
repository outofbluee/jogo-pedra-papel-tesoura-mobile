import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import GameScreen from './src/screens/GameScreen';
import HistoryScreen from './src/screens/HistoryScreen';

type Tela = 'jogo' | 'historico';

export default function App() {
  const [telaAtual, setTelaAtual] = useState<Tela>('jogo');

  return (
    <View style={styles.container}>
      {telaAtual === 'jogo' ? (
        <GameScreen
          aoAbrirHistorico={() => setTelaAtual('historico')}
        />
      ) : (
        <HistoryScreen
          aoVoltar={() => setTelaAtual('jogo')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});