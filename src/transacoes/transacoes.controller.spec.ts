import { Test, TestingModule } from '@nestjs/testing';
import { TransacoesController } from './transacoes.controller';
import { TransacoesService } from './transacoes.service';

describe('TransacoesController', () => {
  let controller: TransacoesController;

  const serviceFalso = {
    readTransacoes: jest.fn().mockResolvedValue({
      historico: [],
      metricas: { saldoTotal: 0, totalDespesas: 0, totalGastoImpulso: 0 },
    }),
    createTransacao: jest.fn().mockResolvedValue('abc123'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransacoesController],
      providers: [{ provide: TransacoesService, useValue: serviceFalso }],
    }).compile();

    controller = module.get<TransacoesController>(TransacoesController);
  });

  it('GET deve devolver historico e metricas', async () => {
    const resposta = await controller.readAllTransacoes();
    expect(resposta).toHaveProperty('historico');
    expect(resposta).toHaveProperty('metricas');
  });

  it('POST deve devolver o id criado', async () => {
    const resposta = await controller.createTransacao({
      descricao: 'Salário',
      valor: 2000,
      tipo: 'receita',
      categoria: 'Trabalho',
      consumoConsciente: true,
    });
    expect(resposta).toEqual({ id: 'abc123' });
  });
});
