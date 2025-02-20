import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import {Repository} from "typeorm";
import {Chat} from "../entities/chat.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>
    ) {}

    async findByItem(itemId: number, userId: number) {
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

    async findChatsByBuyer(buyerId: number) {
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
        } catch (error) {
            console.error("Error finding chats by buyer:", error);
            throw error;
        }
    }


    async create(body: Partial<Chat>) {
        if (body.receiverId === body.senderId) {
            throw new ConflictException("Sender and receiver ID's are the same");
        }

        body.messageDate = new Date().toISOString();

        return await this.chatRepository.save(body);
    }

    async delete(id: number) {
        const chat = await this.chatRepository.findOne({
            where: {
                id: id,
            }
        });

        if (!chat) {
            throw new NotFoundException("Not Found");
        }

        await this.chatRepository.delete(id);
    }
}