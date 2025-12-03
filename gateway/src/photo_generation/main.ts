import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PhotoModule } from './photo.module';

async function bootstrap() {
    const urls = [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'];
    const queue = process.env.PHOTO_QUEUE ?? 'photo_rpc';

    const microservice =
        await NestFactory.createMicroservice<MicroserviceOptions>(PhotoModule, {
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
