"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGatewayGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("../chat/chat.service");
const chat_entity_1 = require("../entities/chat.entity");
const common_1 = require("@nestjs/common");
let ChatGatewayGateway = class ChatGatewayGateway {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async handleSendMessage(client, payload) {
        const savedMessage = await this.chatService.create(payload);
        this.server.to(`item-${payload.itemId}`).emit('recMessage', savedMessage);
    }
    handleJoinRoom(client, { itemId }) {
        client.join(`item-${itemId}`);
    }
    handleLeaveRoom(client, { itemId }) {
        client.leave(`item-${itemId}`);
    }
    async handleDeleteMessage(client, payload) {
        try {
            await this.chatService.delete(payload.messageId);
            this.server.to(`item-${payload.itemId}`).emit('messageDeleted', { messageId: payload.messageId });
        }
        catch (error) {
            console.error("Ошибка при удалении сообщения:", error);
            if (error instanceof common_1.NotFoundException) {
                console.warn(`Сообщение с ID ${payload.messageId} не найдено.`);
            }
            else {
                client.emit('error', { message: "Не удалось удалить сообщение." });
            }
        }
    }
    afterInit(server) {
        console.log(server);
    }
    handleDisconnect(client) {
        console.log(`Disconnected: ${client.id}`);
    }
    handleConnection(client, ...args) {
        console.log(`Connected ${client.id}`);
    }
};
exports.ChatGatewayGateway = ChatGatewayGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGatewayGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, chat_entity_1.Chat]),
    __metadata("design:returntype", Promise)
], ChatGatewayGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGatewayGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGatewayGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGatewayGateway.prototype, "handleDeleteMessage", null);
exports.ChatGatewayGateway = ChatGatewayGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        }
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGatewayGateway);
//# sourceMappingURL=chat_gateway.gateway.js.map