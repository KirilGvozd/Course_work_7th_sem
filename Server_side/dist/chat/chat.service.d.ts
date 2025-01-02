import { Repository } from "typeorm";
import { Chat } from "../entities/chat.entity";
import { UpdateChatDto } from "./dto/updateChatDto.dto";
export declare class ChatService {
    private chatRepository;
    constructor(chatRepository: Repository<Chat>);
    findByItem(itemId: number, userId: number): Promise<Chat[]>;
    findChatsByBuyer(buyerId: number): Promise<any[]>;
    create(body: Partial<Chat>): Promise<Partial<Chat> & Chat>;
    updateMessage(messageId: number, body: UpdateChatDto, userId: number): Promise<void>;
    delete(id: number, userId: number): Promise<void>;
}
