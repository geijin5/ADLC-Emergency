import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatChannelType } from './entities/chat-message.entity';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('channels/:channelType/:channelId')
  getMessages(
    @Param('channelType') channelType: ChatChannelType,
    @Param('channelId') channelId: string,
  ) {
    return this.chatService.findByChannel(channelType, channelId);
  }
}

