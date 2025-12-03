import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type {
  ChatMessageRequest,
  ChatMessageResponse,
} from '../common/dto/chat-message.dto';

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);
  private readonly openAi: OpenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    this.openAi = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
    });
    this.model =
      configService.get<string>('OPENAI_MODEL') ?? 'x-ai/grok-4.1-fast:free';
  }

  async generate(payload: ChatMessageRequest): Promise<ChatMessageResponse> {
    const systemPrompt =
      'Ты дружелюбный Telegram-бот. Отвечай кратко и по делу, используй markdown там, где это уместно.';

    const completion = await this.openAi.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: payload.prompt },
      ],
      temperature: 0.7,
    });

    type ORChatMessage = (typeof completion)['choices'][number]['message'] & {
      reasoning_details?: unknown;
    };
    const answer = completion.choices[0].message as ORChatMessage;

    this.logger.debug(
      `Answer generated for chat ${payload.chatId} using ${completion.model}`,
    );

    return {
      answer: answer.content?.trim() ?? 'Не удалось построить ответ.',
      model: completion.model,
      promptTokens: completion.usage?.prompt_tokens ?? 0,
      completionTokens: completion.usage?.completion_tokens ?? 0,
    };
  }
}
