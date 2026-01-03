import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import './PersonnelChat.css';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

export default function PersonnelChat() {
  const { token, user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [channel, setChannel] = useState('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;

    const newSocket = io(`${WS_URL}/chat`, {
      auth: { token },
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_channel', { channelType: 'group', channelId: channel });
    });

    newSocket.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token, channel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!socket || !inputMessage.trim()) return;

    socket.emit('send_message', {
      channelType: 'group',
      channelId: channel,
      message: inputMessage,
    });

    setInputMessage('');
  };

  return (
    <div className="personnel-chat">
      <h2>Internal Chat</h2>
      <div className="chat-container">
        <div className="chat-sidebar">
          <h3>Channels</h3>
          <button
            className={channel === 'general' ? 'active' : ''}
            onClick={() => setChannel('general')}
          >
            General
          </button>
          <button
            className={channel === 'dispatch' ? 'active' : ''}
            onClick={() => setChannel('dispatch')}
          >
            Dispatch
          </button>
        </div>
        <div className="chat-main">
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className="chat-message">
                <div className="message-header">
                  <span className="message-sender">
                    {msg.sender?.firstName} {msg.sender?.lastName}
                  </span>
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="message-text">{msg.message}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

