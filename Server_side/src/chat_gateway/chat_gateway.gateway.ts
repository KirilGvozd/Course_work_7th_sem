import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { Chat } from '../entities/chat.entity';
import {NotFoundException} from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  }
})
export class ChatGatewayGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: Chat) {
    const savedMessage = await this.chatService.create(payload);
    this.server.to(`item-${payload.itemId}`).emit('recMessage', savedMessage);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, { itemId }: { itemId: number }): void {
    client.join(`item-${itemId}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, { itemId }: { itemId: number }): void {
    client.leave(`item-${itemId}`);
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(client: Socket, payload: { messageId: number; itemId: number }) {
    try {
      // Удаляем сообщение из базы данных
      await this.chatService.delete(payload.messageId);

      // Рассылаем событие удаления сообщения всем участникам комнаты
      this.server.to(`item-${payload.itemId}`).emit('messageDeleted', { messageId: payload.messageId });
    } catch (error) {
      console.error("Ошибка при удалении сообщения:", error);
      // Не отправляем ошибку на клиент, если сообщение не найдено
      if (error instanceof NotFoundException) {
        console.warn(`Сообщение с ID ${payload.messageId} не найдено.`);
      } else {
        client.emit('error', { message: "Не удалось удалить сообщение." });
      }
    }
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }
}
