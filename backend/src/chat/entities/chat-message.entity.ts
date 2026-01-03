import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ChatChannelType {
  DIRECT = 'direct',
  GROUP = 'group',
  INCIDENT = 'incident',
}

@Entity('chat_messages')
@Index(['channelType', 'channelId'])
@Index(['createdAt'])
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column()
  senderId: string;

  @Column({
    type: 'enum',
    enum: ChatChannelType,
    default: ChatChannelType.DIRECT,
  })
  channelType: ChatChannelType;

  @Column()
  channelId: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  readAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

