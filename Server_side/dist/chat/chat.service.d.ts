import { Repository } from "typeorm";
import { Chat } from "../entities/chat.entity";
import { CreateChatDto } from "./dto/createChatDto";
import { PaginationDto } from "../pagination.dto";
import { UpdateChatDto } from "./dto/updateChatDto.dto";
export declare class ChatService {
    private chatRepository;
    constructor(chatRepository: Repository<Chat>);
    findAll(paginationDto: PaginationDto, userId: number): Promise<Chat[] | {
        message: string;
    }>;
    findChat(itemId: number, senderId: number, receiverId: number): Promise<Chat[]>;
    create(body: CreateChatDto): Promise<void>;
    updateMessage(messageId: number, body: UpdateChatDto, userId: number): Promise<void>;
    delete(id: number, userId: number): Promise<void>;
}
