import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Metricas, RespostaTransacoes, Transacao } from './transacoes.dto';

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel('Transacao') private readonly transacaoModel: Model<Transacao>,
  ) {}

  // CREATE
  async createTransacao(transacao: Transacao): Promise<string> {
    // Validação simples para devolver um erro 400 claro em vez de erro 500
    if (transacao.tipo !== 'receita' && transacao.tipo !== 'despesa') {
      throw new BadRequestException(
        'O campo tipo deve ser "receita" ou "despesa".',
      );
    }
    if (typeof transacao.valor !== 'number' || transacao.valor < 0) {
      throw new BadRequestException(
        'O campo valor deve ser um número maior ou igual a zero.',
      );
    }
    if (typeof transacao.consumoConsciente !== 'boolean') {
      throw new BadRequestException(
        'O campo consumoConsciente deve ser true ou false.',
      );
    }

    const transacaoModel = new this.transacaoModel({
      descricao: transacao.descricao,
      valor: transacao.valor,
      tipo: transacao.tipo,
      categoria: transacao.categoria,
      consumoConsciente: transacao.consumoConsciente,
    });
    const result = await transacaoModel.save();
    return result.id as string;
  }

  // READ: histórico + métricas
  async readTransacoes(): Promise<RespostaTransacoes> {
    const transacoes = await this.transacaoModel.find().exec();

    // Remove _id e __v, deixando o objeto igual à interface
    const historico: Transacao[] = transacoes.map((t) => ({
      id: t.id as string,
      descricao: t.descricao,
      valor: t.valor,
      tipo: t.tipo,
      categoria: t.categoria,
      consumoConsciente: t.consumoConsciente,
    }));

    return {
      historico,
      metricas: this.calcularMetricas(historico),
    };
  }

  // Processa os dados e calcula as métricas pedidas no exercício
  calcularMetricas(historico: Transacao[]): Metricas {
    let totalReceitas = 0;
    let totalDespesas = 0;
    let totalGastoImpulso = 0;

    for (const t of historico) {
      if (t.tipo === 'receita') {
        totalReceitas += t.valor;
      } else if (t.tipo === 'despesa') {
        totalDespesas += t.valor;
        if (t.consumoConsciente === false) {
          totalGastoImpulso += t.valor;
        }
      }
    }

    // Arredonda para 2 casas decimais (evita 0.1 + 0.2 = 0.30000000000000004)
    const arredondar = (n: number) => Math.round(n * 100) / 100;

    return {
      saldoTotal: arredondar(totalReceitas - totalDespesas),
      totalDespesas: arredondar(totalDespesas),
      totalGastoImpulso: arredondar(totalGastoImpulso),
    };
  }
}
