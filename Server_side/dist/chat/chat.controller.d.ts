import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/createChatDto";
import { PaginationDto } from "../pagination.dto";
import { UpdateChatDto } from "./dto/updateChatDto.dto";
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    findAll(paginationDto: PaginationDto, request: any): Promise<import("../entities/chat.entity").Chat[] | {
        message: string;
    }>;
    findChat(request: any, id: number): Promise<import("../entities/chat.entity").Chat[]>;
    create(body: CreateChatDto): Promise<void>;
    update(body: UpdateChatDto, id: number, request: any): Promise<void>;
    delete(id: number, request: any): Promise<void>;
}
