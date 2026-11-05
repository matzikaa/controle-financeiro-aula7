import { Body, Controller, Get, Post } from '@nestjs/common';
import type { RespostaTransacoes, Transacao } from './transacoes.dto';
import { TransacoesService } from './transacoes.service';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  // GET /transacoes -> histórico + métricas calculadas no Service
  @Get()
  readAllTransacoes(): Promise<RespostaTransacoes> {
    return this.transacoesService.readTransacoes();
  }

  // POST /transacoes -> cadastra uma nova receita ou despesa
  @Post()
  async createTransacao(@Body() transacao: Transacao): Promise<{ id: string }> {
    const resposta = await this.transacoesService.createTransacao(transacao);
    return { id: resposta };
  }
}
