/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TransacoesService } from './transacoes.service';

// Dados de exemplo, como se estivessem salvos no banco
const transacoesNoBanco = [
  {
    id: '1',
    descricao: 'Salário',
    valor: 2500,
    tipo: 'receita',
    categoria: 'Trabalho',
    consumoConsciente: true,
  },
  {
    id: '2',
    descricao: 'Conta de Luz',
    valor: 180.5,
    tipo: 'despesa',
    categoria: 'Moradia',
    consumoConsciente: true,
  },
  {
    id: '3',
    descricao: 'Delivery de lanche',
    valor: 65.9,
    tipo: 'despesa',
    categoria: 'Alimentação',
    consumoConsciente: false,
  },
  {
    id: '4',
    descricao: 'Roupa em promoção',
    valor: 120,
    tipo: 'despesa',
    categoria: 'Lazer',
    consumoConsciente: false,
  },
];

// "Model" falso do Mongoose
const modelFalso: any = jest.fn().mockImplementation((dados) => ({
  ...dados,
  save: jest.fn().mockResolvedValue({ id: 'novo-id' }),
}));
modelFalso.find = jest.fn().mockReturnValue({
  exec: jest.fn().mockResolvedValue(transacoesNoBanco),
});

describe('TransacoesService', () => {
  let service: TransacoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransacoesService,
        { provide: getModelToken('Transacao'), useValue: modelFalso },
      ],
    }).compile();

    service = module.get<TransacoesService>(TransacoesService);
  });

  it('deve retornar o histórico e as métricas', async () => {
    const resposta = await service.readTransacoes();

    expect(resposta.historico).toHaveLength(4);
    expect(resposta.metricas).toEqual({
      saldoTotal: 2133.6, // 2500 - (180.5 + 65.9 + 120)
      totalDespesas: 366.4,
      totalGastoImpulso: 185.9, // 65.9 + 120
    });
  });

  it('deve cadastrar uma transação e devolver o id', async () => {
    const id = await service.createTransacao({
      descricao: 'Mercado',
      valor: 300,
      tipo: 'despesa',
      categoria: 'Alimentação',
      consumoConsciente: true,
    });
    expect(id).toBe('novo-id');
  });

  it('deve recusar tipo diferente de receita/despesa', async () => {
    await expect(
      service.createTransacao({
        descricao: 'Teste',
        valor: 10,
        tipo: 'investimento' as any,
        categoria: 'Outros',
        consumoConsciente: true,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('com lista vazia, as métricas devem ser zero', () => {
    expect(service.calcularMetricas([])).toEqual({
      saldoTotal: 0,
      totalDespesas: 0,
      totalGastoImpulso: 0,
    });
  });
});
