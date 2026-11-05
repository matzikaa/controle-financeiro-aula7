import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransacoesModule } from './transacoes/transacoes.module';

@Module({
  imports: [
    // Lê o arquivo .env (assim a senha do banco não vai para o GitHub)
    ConfigModule.forRoot(),
    // String de conexão do MongoDB Atlas, ex:
    // mongodb+srv://<usuario>:<senha>@cluster0.xxxxx.mongodb.net/controle-financeiro?retryWrites=true&w=majority
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    TransacoesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
