import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type {
    ChatPhotoRequest,
    ChatPhotoResponse,
} from '../common/dto/chat-message.dto';

@Injectable()
export class PhotoService {
    private readonly logger = new Logger(PhotoService.name);
    private readonly openAi: OpenAI;

    constructor(private readonly configService: ConfigService) {
        const apiKey = configService.get<string>('OPENAI_API_KEY');
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY is not configured');
        }

        this.openAi = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey,
        });
    }

    async generatePhoto(payload: ChatPhotoRequest): Promise<ChatPhotoResponse> {
        try {
            const response = await this.openAi.images.generate({
                model: this.configService.get<string>('PHOTO_MODEL'),
                prompt: payload.prompt,
                n: 1,
                size: '1024x1024',
                quality: 'standard',
                response_format: 'url',
            });

            this.logger.debug(
                `Photo generated for chat ${payload.chatId} using ${this.configService.get<string>('PHOTO_MODEL')}`,
            );

            return {
                imageUrl: response.data?.[0]?.url ?? '',
                model: this.configService.get<string>('PHOTO_MODEL') || "",
            };
        } catch (error) {
            this.logger.error('Failed to generate photo', error);
            return {
                imageUrl: '',
                model: this.configService.get<string>('PHOTO_MODEL') || "",
            };
        }
    }
}
