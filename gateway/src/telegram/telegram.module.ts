import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramService } from './telegram.service';
import { ChatClientModule } from '../rmq/chat-client.module';
import { ChatClientService } from 'src/rmq/chat-client.service';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    ConfigModule,
    ChatClientModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        token: config.getOrThrow<string>('TELEGRAM_BOT_TOKEN'),
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [TelegramService, UsersService],
})
export class TelegramModule { }
