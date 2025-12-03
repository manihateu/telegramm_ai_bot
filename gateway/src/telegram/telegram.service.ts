import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { ChatClientService } from '../rmq/chat-client.service';

@Update()
@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(private readonly chatClient: ChatClientService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply(
      'Привет! Я бот, который с помощью ChatGPT отвечает на вопросы. Напиши мне что-нибудь.',
    );
  }

  @Hears(/\/help/)
  async onHelp(@Ctx() ctx: Context) {
    await ctx.reply(
      'Просто отправь сообщение, и я спрошу об этом нейросеть. Команда /reset пока не реализована.',
    );
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context) {
    const text =
      ctx.message && 'text' in ctx.message ? ctx.message.text.trim() : '';
    if (!text) {
      await ctx.reply('Пожалуйста, отправь текстовое сообщение.');
      return;
    }

    try {
      await ctx.sendChatAction('typing');
      const response = await this.chatClient.generateReply({
        chatId: ctx.chat?.id ?? 0,
        username: ctx.from?.username,
        prompt: text,
      });

      await ctx.reply(response.answer);
    } catch (error) {
      this.logger.error('Failed to process message', error);
      await ctx.reply(
        'Не удалось получить ответ от нейросети, попробуй позже.',
      );
    }
  }
}
