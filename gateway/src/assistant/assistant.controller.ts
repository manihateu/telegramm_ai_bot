import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AssistantService } from './assistant.service';
import { CHAT_RPC_PATTERN } from '../rmq/chat-client.constants';
import * as chatMessageDto from '../common/dto/chat-message.dto';

@Controller()
export class AssistantController {
  private readonly logger = new Logger(AssistantController.name);

  constructor(private readonly assistantService: AssistantService) {}

  @MessagePattern(CHAT_RPC_PATTERN)
  async handleMessage(
    @Payload() payload: chatMessageDto.ChatMessageRequest,
  ): Promise<chatMessageDto.ChatMessageResponse> {
    this.logger.debug(
      `Prompt from chat ${payload.chatId} (${payload.username ?? 'unknown'})`,
    );

    const result = await this.assistantService.generate(payload);
    this.logger.debug(
      `Answer generated for chat ${payload.chatId} using ${result.model}`,
    );
    return result;
  }
}
