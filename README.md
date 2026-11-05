# Controle Financeiro Pessoal — API (NestJS + MongoDB)

Atividade extensionista da Aula 7 de Web Mobile. API RESTful que registra receitas e despesas
e calcula métricas para apoiar o letramento financeiro (ODS 1 e ODS 12).

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env` na raiz (copie o `.env.example`) com a sua string do MongoDB Atlas:
   ```
   MONGODB_URI=mongodb+srv://<usuario>:<senha>@cluster0.xxxxx.mongodb.net/controle-financeiro?retryWrites=true&w=majority
   ```
   O `.env` está no `.gitignore`, então sua senha não vai para o GitHub.
3. Rode o projeto:
   ```bash
   npm run start:dev
   ```
4. Testes:
   ```bash
   npm test
   ```

## Endpoints

### POST /transacoes
Cadastra uma receita ou despesa.

```json
{
  "descricao": "Delivery de lanche",
  "valor": 65.9,
  "tipo": "despesa",
  "categoria": "Alimentação",
  "consumoConsciente": false
}
```
Resposta: `{ "id": "..." }`. Se `tipo` não for `receita` ou `despesa`, retorna erro 400.

### GET /transacoes
Retorna o histórico e as métricas calculadas no Service:

```json
{
  "historico": [ { "id": "...", "descricao": "Salário", "valor": 2500, "tipo": "receita", "categoria": "Trabalho", "consumoConsciente": true } ],
  "metricas": {
    "saldoTotal": 2133.6,
    "totalDespesas": 366.4,
    "totalGastoImpulso": 185.9
  }
}
```

- **saldoTotal**: soma das receitas menos as despesas
- **totalDespesas**: soma das transações do tipo "despesa"
- **totalGastoImpulso**: soma das despesas com `consumoConsciente: false`

## Estrutura

```
src/
  app.module.ts                  -> conexão com o MongoDB (MongooseModule.forRoot)
  transacoes/
    transacoes.dto.ts            -> Schema do Mongoose + interface Transacao
    transacoes.module.ts
    transacoes.controller.ts     -> rotas GET e POST
    transacoes.service.ts        -> acesso ao banco e cálculo das métricas
```
