import * as mongoose from 'mongoose';

// Schema do Mongoose: define como uma transação é salva no MongoDB
export const TransacaoSchema = new mongoose.Schema({
  descricao: { type: String, required: true }, // Ex: "Conta de Luz"
  valor: { type: Number, required: true, min: 0 }, // valor monetário
  tipo: { type: String, required: true, enum: ['receita', 'despesa'] }, // só aceita esses dois valores
  categoria: { type: String, required: true }, // Ex: "Moradia", "Lazer"
  consumoConsciente: { type: Boolean, required: true }, // false = gasto por impulso (ODS 12)
});

// Interface: representa o mesmo objeto no TypeScript
export interface Transacao {
  id?: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  consumoConsciente: boolean;
}

// Formato da resposta do GET /transacoes
export interface Metricas {
  saldoTotal: number;
  totalDespesas: number;
  totalGastoImpulso: number;
}

export interface RespostaTransacoes {
  historico: Transacao[];
  metricas: Metricas;
}
