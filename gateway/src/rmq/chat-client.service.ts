/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { CHAT_CLIENT, CHAT_RPC_PATTERN } from './chat-client.constants';
import type {
  ChatMessageRequest,
  ChatMessageResponse,
} from '../common/dto/chat-message.dto';

@Injectable()
export class ChatClientService {
  private readonly logger = new Logger(ChatClientService.name);

  constructor(@Inject(CHAT_CLIENT) private readonly client: ClientProxy) {}

  async generateReply(
    payload: ChatMessageRequest,
  ): Promise<ChatMessageResponse> {
    try {
      const response$ = this.client
        .send<
          ChatMessageResponse,
          ChatMessageRequest
        >(CHAT_RPC_PATTERN, payload)
        .pipe(timeout(15000));

      return await lastValueFrom(response$);
    } catch (error) {
      this.logger.error('Failed to get response from assistant', error);
      throw error;
    }
  }
}
