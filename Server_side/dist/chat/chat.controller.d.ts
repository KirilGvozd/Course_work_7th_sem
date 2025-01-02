import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/createChatDto";
import { UpdateChatDto } from "./dto/updateChatDto.dto";
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getChatsByItem(itemId: number, req: any): Promise<import("../entities/chat.entity").Chat[]>;
    getChatsForBuyer(req: any): Promise<any[]>;
    create(body: CreateChatDto): Promise<Partial<import("../entities/chat.entity").Chat> & import("../entities/chat.entity").Chat>;
    update(body: UpdateChatDto, id: number, request: any): Promise<void>;
    delete(id: number, request: any): Promise<void>;
}
