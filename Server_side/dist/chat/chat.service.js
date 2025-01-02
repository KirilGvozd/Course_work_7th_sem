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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const chat_entity_1 = require("../entities/chat.entity");
const typeorm_2 = require("@nestjs/typeorm");
let ChatService = class ChatService {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async findByItem(itemId, userId) {
        return this.chatRepository.find({
            where: [
                {
                    itemId: itemId,
                    senderId: userId,
                },
                {
                    itemId: itemId,
                    receiverId: userId,
                }
            ],
            relations: ['sender', 'receiver', 'item'],
            order: { messageDate: 'ASC' },
        });
    }
    async findChatsByBuyer(buyerId) {
        try {
            return await this.chatRepository
                .createQueryBuilder('chat')
                .leftJoinAndSelect('chat.item', 'item')
                .leftJoinAndSelect('chat.sender', 'sender')
                .leftJoinAndSelect('chat.receiver', 'receiver')
                .where('(chat.senderId = :buyerId OR chat.receiverId = :buyerId)', { buyerId })
                .select([
                'DISTINCT item.id as itemId',
                'item.name as itemName',
                'CASE WHEN chat.senderId = :buyerId THEN receiver.id ELSE sender.id END as userId',
                'CASE WHEN chat.senderId = :buyerId THEN receiver.name ELSE sender.name END as userName',
            ])
                .getRawMany();
        }
        catch (error) {
            console.error("Error finding chats by buyer:", error);
            throw error;
        }
    }
    async create(body) {
        if (body.receiverId === body.senderId) {
            throw new common_1.ConflictException("Sender and receiver ID's are the same");
        }
        body.messageDate = new Date().toISOString();
        return await this.chatRepository.save(body);
    }
    async updateMessage(messageId, body, userId) {
        const chat = await this.chatRepository.findOne({
            where: {
                senderId: userId,
            }
        });
        if (!chat) {
            throw new common_1.NotFoundException("Not Found");
        }
        await this.chatRepository.update(messageId, body);
    }
    async delete(id, userId) {
        const chat = await this.chatRepository.findOne({
            where: {
                senderId: userId,
            }
        });
        if (!chat) {
            throw new common_1.NotFoundException("Not Found");
        }
        await this.chatRepository.delete(id);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(chat_entity_1.Chat)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map