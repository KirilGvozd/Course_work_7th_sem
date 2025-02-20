import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/createChatDto";
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getChatByItem(itemId: number, req: any): Promise<import("../entities/chat.entity").Chat[]>;
    getChats(req: any): Promise<any[]>;
    create(body: CreateChatDto): Promise<Partial<import("../entities/chat.entity").Chat> & import("../entities/chat.entity").Chat>;
    delete(id: number, res: any): Promise<any>;
}
