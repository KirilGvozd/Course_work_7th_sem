import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { Chat } from '../entities/chat.entity';
export declare class ChatGatewayGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    constructor(chatService: ChatService);
    server: Server;
    handleSendMessage(client: Socket, payload: Chat): Promise<void>;
    handleJoinRoom(client: Socket, { itemId }: {
        itemId: number;
    }): void;
    handleLeaveRoom(client: Socket, { itemId }: {
        itemId: number;
    }): void;
    afterInit(server: Server): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): void;
}
