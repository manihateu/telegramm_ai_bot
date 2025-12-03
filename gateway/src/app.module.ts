import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from './telegram/telegram.module';
import { ChatClientModule } from './rmq/chat-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ChatClientModule,
    TelegramModule,
  ],
})
export class AppModule {}
