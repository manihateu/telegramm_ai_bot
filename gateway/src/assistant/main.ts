import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AssistantModule } from './assistant.module';

async function bootstrap() {
  const urls = [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'];
  const queue = process.env.CHAT_QUEUE ?? 'chatgpt_rpc';

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AssistantModule, {
      transport: Transport.RMQ,
      options: {
        urls,
        queue,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    });

  await microservice.listen();
}

void bootstrap();
