import { Test, TestingModule } from '@nestjs/testing';
import { TelegramService } from './telegram.service';
import { ChatClientService } from '../rmq/chat-client.service';

describe('TelegramService', () => {
  let service: TelegramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramService,
        {
          provide: ChatClientService,
          useValue: {
            generateReply: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TelegramService>(TelegramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
