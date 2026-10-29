# Parte 1 — Questões teórico-práticas

## 1. Dispositivos móveis
### a.
No smartphone o usuário tem uma interação diretamente com a tela, enquanto que no computador ele tem com o mouse e teclado. Dessa forma, é necessário planejar botões e UI que facilitem o toque e uso do usuário que está no smartphone. Além disso, o tamanho do display do smartphone é menor comparado com o do desktop, assim é necessário formatar as informações para que sejam exibidas corretamente na tela e sejam legíveis.

### b.
Quando o aplicativo é fechado as informações de histórico mantidas na memória do próprio programa são perdidas. A forma de manter o histórico mesmo após o encerramento do app é persistir esses dados de alguma forma, como com um banco de dados que permite recuperar os dados.

## 2. Arquitetura e infraestrutura
### a.
A interface fica no aplicativo. A validação, o sorteio e o cálculo do resultado ficam na API. A persistência fica no banco de dados. O aplicativo não deve decidir o resultado oficial, pois suas requisições podem ser manipuladas pelo usuário. Por isso, a API deve calcular o resultado e não confiar em valores enviados pelo lado cliente.

### b.
O problema pode ser em que endereço o emulador está utilizando, ele deve apontar para http://'enderecodocomputador':8000 e não para http://localhost:8000. Então, eu verificaria para onde o emulador está apontando.

Também há chances de que o aplicativo rodando no computador não aceite requisições externas, o que normalmente acontece como padrão para aplicações. Nesse caso a verificação seria verificar se há bloqueio para requisições externas e após liberar testar a conexão do emulador com o aplicativo no computador.

## 3. Interface móvel
### a.
A tela terá o placar na parte superior, mostrando vitórias, derrotas e empates. No centro, serão exibidas as escolhas do jogador e do computador, seguidas de um texto indicando o resultado da rodada. Na parte inferior, haverá três botões grandes para selecionar pedra, papel ou tesoura e, abaixo deles, o botão Jogar.

Para facilitar o uso em smartphones, os botões terão áreas de toque grandes, espaçamento adequado e textos legíveis. O resultado será apresentado por escrito como vitória, derrota ou empate, acompanhado das escolhas de cada participante, sem depender apenas de cores. A opção selecionada também será destacada visualmente.

### b.
Carregando: exibir um indicador de carregamento enquanto o aplicativo consulta a API.
Consulta concluída sem rodadas: se a API retornar 200 com uma lista vazia ([]), exibir a mensagem “Ainda não há histórico de partidas”.
Consulta concluída com rodadas: listar as partidas retornadas pela API, da mais recente para a mais antiga, mostrando as jogadas do jogador e do servidor, o resultado e a data/hora.
Falha na consulta: exibir uma mensagem informando que não foi possível carregar o histórico e oferecer um botão para tentar novamente. O aplicativo não deve tratar essa falha como uma lista vazia.

## 4. Comunicação e segurança
### a.
1. O jogador seleciona uma jogada e toca em Jogar.
2. Desabilitar o botão e mostrar um indicador de carregamento.
3. Enviar a jogada à API por uma requisição HTTP com JSON.
4. Aguardar a resposta, respeitando o tempo limite de 15 segundos.
5. Se ocorrer uma falha de comunicação ou tempo limite:
   - Informar que não foi possível confirmar a rodada.
   - Permitir consultar o histórico.
   - Não reenviar a jogada automaticamente.
6. Se a API retornar um erro HTTP:
   - Exibir uma mensagem de erro, incluindo detalhes úteis quando disponíveis.
7. Se a API retornar HTTP 201 e os dados esperados da rodada:
   - Exibir as jogadas do jogador e do servidor e o resultado confirmado.
   - Atualizar o placar a partir do histórico da API.
8. Ao terminar, liberar o botão e encerrar o indicador de carregamento.

### b.
O aplicativo pode ser modificado ou ter suas requisições manipuladas pelo usuário. Por isso, a validação não deve ocorrer somente no aplicativo.

A API deve validar a estrutura da requisição e aceitar somente o campo `jogada`, com o valor `pedra`, `papel` ou `tesoura`. Se a requisição incluir campos extras, como `resultado`, deve retornar HTTP 422 e não salvar a rodada. O sorteio da jogada do servidor e o cálculo do resultado devem ser realizados exclusivamente pela API.

## 5. Plataformas móveis
### a.
Android e iOS possuem ferramentas e ambientes de desenvolvimento diferentes. Para Android, podemos utilizar o Android Studio e seu emulador; para iOS, o desenvolvimento e a simulação normalmente utilizam o Xcode em um Mac. Isso afeta os equipamentos e a configuração necessários para testar o aplicativo.

A distribuição também é diferente: no Android, os aplicativos podem ser distribuídos por diferentes meios, enquanto no iOS a distribuição normalmente utiliza os mecanismos da Apple, como a App Store. Essas diferenças afetam a forma de testar e entregar o projeto.

Como o projeto exige execução em Android, podemos concentrar os testes no emulador Android, sem precisar implementar e testar a versão iOS.

### b.
Uma vantagem do React Native é permitir o desenvolvimento para Android e iOS com grande parte do código compartilhado, utilizando JavaScript, uma linguagem que a equipe já conhece. Isso reduz a duplicação de código e facilita a manutenção.

Uma limitação é que recursos específicos de cada sistema operacional podem exigir bibliotecas adicionais ou código nativo, enquanto o desenvolvimento nativo oferece acesso mais direto às APIs e ferramentas de cada plataforma.
