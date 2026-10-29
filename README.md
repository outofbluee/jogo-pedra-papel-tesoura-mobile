# Pedra, Papel e Tesoura

Aplicativo móvel desenvolvido como atividade da disciplina de Programação para Dispositivos Móveis.

O projeto implementa o jogo Pedra, Papel e Tesoura. O aplicativo permite realizar jogadas contra o servidor, consultar o resultado de cada rodada e visualizar o histórico das partidas.

## Tecnologias utilizadas

### Aplicativo móvel
- React Native
- TypeScript
- Android

### API
- Python
- FastAPI
- SQLite
- Uvicorn

## Estrutura do projeto

```text
jogo-pedra-papel-tesoura/
├── api/          # Código-fonte da API e banco de dados
├── app/          # Aplicativo móvel React Native
├── README.md     # Instruções do projeto
└── RESPOSTAS.md  # Respostas da parte teórica da atividade
```

## Funcionalidades

- Realizar jogadas de pedra, papel ou tesoura.
- Sortear a jogada do servidor.
- Calcular o resultado da rodada no servidor.
- Salvar as rodadas em um banco de dados SQLite.
- Consultar o histórico das partidas.
- Exibir o placar de vitórias, empates e derrotas.
- Apresentar indicadores de carregamento e mensagens de erro quando necessário.

## Requisitos para execução

- Node.js e npm.
- Python e pip.
- Android Studio e Android SDK.
- Um dispositivo Android conectado por USB ou um emulador Android.

## Como executar a API

Entre na pasta da API:

```bash
cd api
```

Crie e ative um ambiente virtual Python:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Inicie o servidor:

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

A API ficará disponível localmente na porta 8000 do computador.

A documentação interativa pode ser acessada em `/docs`, utilizando o endereço do servidor.

## Como executar o aplicativo

Em outro terminal, entre na pasta do aplicativo:

```bash
cd app
```

Instale as dependências JavaScript:

```bash
npm install
```

Inicie o Metro:

```bash
npm start
```

Com o dispositivo Android conectado e autorizado pelo ADB, abra outro terminal e execute:

```bash
npm run android
```

Se necessário, configure o encaminhamento da porta do Metro para o dispositivo USB:

```bash
adb reverse tcp:8081 tcp:8081
```

Para encaminhar também a API ao dispositivo físico conectado por USB, execute:

```bash
adb reverse tcp:8000 tcp:8000
```

Mantenha esse encaminhamento ativo enquanto usar o app. Com ele, o endereço
`127.0.0.1` usado pelo app é encaminhado pelo USB para o computador; não é
necessário descobrir o IP local nem conectar o celular à mesma rede Wi-Fi.

## Configuração do endereço da API

O aplicativo utiliza `app/src/config.ts`, configurado para
`http://127.0.0.1:8000`. Essa configuração funciona em um dispositivo físico
quando o encaminhamento USB da porta 8000 está ativo.

No emulador Android padrão, o endereço do computador host é diferente. Para
usar o emulador, altere temporariamente `API_URL` para:

```text
http://10.0.2.2:8000
```

Esse endereço especial do emulador encaminha a conexão para o computador host.

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Verifica se a API está funcionando. |
| GET | `/saude` | Retorna o estado da API. |
| POST | `/rodadas` | Cria e salva uma rodada. |
| GET | `/rodadas` | Lista as rodadas registradas. |

### Exemplo de requisição

```json
{
  "jogada": "pedra"
}
```

As jogadas permitidas são `pedra`, `papel` e `tesoura`.

A API valida a entrada, sorteia a jogada do servidor, calcula o resultado e salva a rodada no banco de dados.

## Banco de dados

As rodadas são armazenadas no SQLite, no arquivo `api/jogo.db`, criado ou inicializado pela API.

Cada rodada contém:
- `id`: identificador da rodada.
- `jogada_jogador`: jogada escolhida pelo jogador.
- `jogada_servidor`: jogada sorteada pelo servidor.
- `resultado`: vitória, derrota ou empate.
- `criada_em`: data e hora da rodada.

## Tratamento de erros

O aplicativo apresenta mensagens de erro quando não consegue se comunicar com a API. As requisições possuem tempo limite, e o aplicativo não realiza novas jogadas automaticamente quando não é possível confirmar uma operação.

A API rejeita entradas inválidas e campos adicionais não permitidos.

## Limitações e observações

- O aplicativo foi desenvolvido e testado em dispositivo Android.
- O acesso HTTP está habilitado para o desenvolvimento local; não use essa configuração como base para uma versão de produção distribuída.
- A execução depende de a API estar disponível.
- O ambiente Python utilizado no desenvolvimento é o Python 3.12 disponibilizado pelo sistema operacional.
