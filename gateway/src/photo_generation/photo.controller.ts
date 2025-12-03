import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PhotoService } from './photo.service';
import * as chatMessageDto from '../common/dto/chat-message.dto';

@Controller()
export class PhotoController {
    private readonly logger = new Logger(PhotoController.name);

    constructor(private readonly photoService: PhotoService) { }

    @MessagePattern('generate_photo')
    async handlePhoto(
        @Payload() payload: chatMessageDto.ChatPhotoRequest,
    ): Promise<chatMessageDto.ChatPhotoResponse> {
        this.logger.debug(
            `Photo prompt from chat ${payload.chatId} (${payload.username ?? 'unknown'})`,
        );

        return await this.photoService.generatePhoto(payload);
    }
}
