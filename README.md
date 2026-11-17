# senai-devops

API REST e CLI do **Jogo do Número Secreto**: o jogador tem 10 tentativas para descobrir um número entre 1 e 5000, perdendo pontos conforme a distância de cada palpite.

## Requisitos

- Node.js 20+
- Docker (opcional)

## Como rodar

```bash
npm ci

npm start            # API em http://localhost:3000 (porta configurável via PORT)
npm run dev          # API com reload automático
npm run cli          # jogar no terminal
npm test             # testes
npm run test:coverage
```

### Docker

```bash
docker build -t senai-devops .               # roda os testes e gera a imagem de produção
docker run -p 3000:3000 senai-devops

docker build --target test -t senai-devops:test .   # apenas o estágio de testes
```

### Docker Compose (API + Postgres + Observabilidade)

```bash
docker compose up --build -d
```

| Serviço | URL |
| ------- | --- |
| API | http://localhost:3000 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 (`admin` / `admin`) |

Detalhes da stack, dashboards e roteiro de apresentação: [docs/observabilidade/README.md](docs/observabilidade/README.md).

## Endpoints

| Método | Rota                 | Descrição                          |
| ------ | -------------------- | ---------------------------------- |
| GET    | `/health`            | Health check                       |
| GET    | `/metrics`           | Métricas Prometheus                |
| POST   | `/jogos`             | Cria um novo jogo                  |
| GET    | `/jogos/:id`         | Consulta o estado do jogo          |
| POST   | `/jogos/:id/chutes`  | Envia um palpite: `{ "numero": 42 }` |
| DELETE | `/jogos/:id`         | Cancela o jogo                     |

Erros seguem o formato `{ "erro": "mensagem", ... }` com status `400` (palpite ou JSON inválido), `404` (jogo/rota inexistente), `409` (jogo já encerrado) ou `500`.

## Estrutura

```
src/
  server.js          # sobe o servidor HTTP e trata SIGTERM/SIGINT
  app.js             # monta o Express (sem listen, para facilitar testes)
  config/            # variáveis de ambiente
  routes/            # definição das rotas
  controllers/       # traduz HTTP <-> service
  services/          # casos de uso do jogo
  repositories/      # armazenamento dos jogos (em memória)
  domain/            # regras do jogo, sem dependência de HTTP ou terminal
  errors/            # erros da aplicação com status HTTP
  middlewares/       # 404 e tratamento de erros
  metrics/           # Prometheus (prom-client) e /metrics
  cli/               # interface de terminal
observabilidade/     # Prometheus + Grafana (provisionamento)
docs/observabilidade/
test/
  unit/
  integration/
```
