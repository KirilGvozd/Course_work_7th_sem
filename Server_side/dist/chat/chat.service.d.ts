import { Repository } from "typeorm";
import { Chat } from "../entities/chat.entity";
export declare class ChatService {
    private chatRepository;
    constructor(chatRepository: Repository<Chat>);
    findByItem(itemId: number, userId: number): Promise<Chat[]>;
    findChatsByBuyer(buyerId: number): Promise<any[]>;
    create(body: Partial<Chat>): Promise<Partial<Chat> & Chat>;
    delete(id: number): Promise<void>;
}
