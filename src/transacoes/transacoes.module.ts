import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransacoesController } from './transacoes.controller';
import { TransacoesService } from './transacoes.service';
import { TransacaoSchema } from './transacoes.dto';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Transacao', schema: TransacaoSchema }]),
  ],
  controllers: [TransacoesController],
  providers: [TransacoesService],
})
export class TransacoesModule {}
