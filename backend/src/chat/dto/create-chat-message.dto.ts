import { IsString, IsEnum, MinLength } from 'class-validator';
import { ChatChannelType } from '../entities/chat-message.entity';

export class CreateChatMessageDto {
  @IsEnum(ChatChannelType)
  channelType: ChatChannelType;

  @IsString()
  channelId: string;

  @IsString()
  @MinLength(1)
  message: string;
}

