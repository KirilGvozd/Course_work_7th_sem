import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import {Repository} from "typeorm";
import {Chat} from "../entities/chat.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateChatDto} from "./dto/createChatDto";
import {PaginationDto} from "../pagination.dto";
import {DEFAULT_PAGE_SIZE} from "../utils/constants";
import {UpdateChatDto} from "./dto/updateChatDto.dto";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>
    ) {}

    async findAll(paginationDto: PaginationDto, userId: number) {
        const chats = await this.chatRepository.find({
            where: {
                senderId: userId
            },
            skip: paginationDto.skip,
            take: paginationDto.limit ?? DEFAULT_PAGE_SIZE,
        });

        if (chats.length === 0) {
            return { message : "You have no chats!" };
        }

        return chats;
    }

    async findChat(itemId: number, senderId: number, receiverId: number) {
        const result = await this.chatRepository.find({
            where: {
                senderId: senderId,
                receiverId: receiverId,
            }
        });

        if (!result) {
            throw new NotFoundException("There's no chat with this user!");
        }

        return result;
    }

    async create(body: CreateChatDto) {
        if (body.receiverId === body.senderId) {
            throw new ConflictException("Sender and receiver ID's are the same");
        }

        await this.chatRepository.save(body);
    }

    async updateMessage(messageId: number, body: UpdateChatDto, userId: number) {
        const chat = await this.chatRepository.findOne({
            where: {
                senderId: userId,
            }
        });

        if (!chat) {
            throw new NotFoundException("Not Found");
        }
        await this.chatRepository.update(messageId, body);
    }

    async delete(id: number, userId: number) {
        const chat = await this.chatRepository.findOne({
            where: {
                senderId: userId,
            }
        });

        if (!chat) {
            throw new NotFoundException("Not Found");
        }

        await this.chatRepository.delete(id);
    }
}