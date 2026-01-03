import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      const user = await this.usersService.findOne(payload.sub);
      
      if (!user) {
        client.disconnect();
        return;
      }

      client.data.user = user;
      client.join(`user:${user.id}`);
      console.log(`User ${user.email} connected to chat`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() createChatMessageDto: CreateChatMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const message = await this.chatService.create(createChatMessageDto, user);

    // Emit to appropriate channel
    const channelName = `${createChatMessageDto.channelType}:${createChatMessageDto.channelId}`;
    this.server.to(channelName).emit('new_message', message);

    return message;
  }

  @SubscribeMessage('join_channel')
  handleJoinChannel(
    @MessageBody() data: { channelType: string; channelId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const channelName = `${data.channelType}:${data.channelId}`;
    client.join(channelName);
    return { status: 'joined', channel: channelName };
  }

  @SubscribeMessage('leave_channel')
  handleLeaveChannel(
    @MessageBody() data: { channelType: string; channelId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const channelName = `${data.channelType}:${data.channelId}`;
    client.leave(channelName);
    return { status: 'left', channel: channelName };
  }
}

