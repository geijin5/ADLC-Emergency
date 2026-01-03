import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage, ChatChannelType } from './entities/chat-message.entity';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessagesRepository: Repository<ChatMessage>,
  ) {}

  async create(createChatMessageDto: CreateChatMessageDto, sender: User): Promise<ChatMessage> {
    const message = this.chatMessagesRepository.create({
      ...createChatMessageDto,
      sender,
    });
    return this.chatMessagesRepository.save(message);
  }

  async findByChannel(channelType: ChatChannelType, channelId: string): Promise<ChatMessage[]> {
    return this.chatMessagesRepository.find({
      where: { channelType, channelId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async markAsRead(messageId: string, userId: string): Promise<void> {
    await this.chatMessagesRepository.update(
      { id: messageId },
      { isRead: true, readAt: new Date() },
    );
  }
}

