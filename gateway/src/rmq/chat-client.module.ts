import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CHAT_CLIENT, PHOTO_CLIENT } from './chat-client.constants';
import { ChatClientService } from './chat-client.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: CHAT_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const urls = [
          config.get<string>('RABBITMQ_URL') ?? 'amqp://localhost:5672',
        ];
        const queue = config.get<string>('CHAT_QUEUE') ?? 'chatgpt_rpc';

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        return ClientProxyFactory.create({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          transport: Transport.RMQ,
          options: {
            urls,
            queue,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
    {
      provide: PHOTO_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const urls = [
          config.get<string>('RABBITMQ_URL') ?? 'amqp://localhost:5672',
        ];
        const queue = config.get<string>('PHOTO_QUEUE') ?? 'photo_rpc';

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls,
            queue,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
    ChatClientService,
  ],
  exports: [ChatClientService],
})
export class ChatClientModule { }
