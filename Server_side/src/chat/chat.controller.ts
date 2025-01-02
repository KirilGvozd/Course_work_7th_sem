import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Req,
    UseGuards
} from "@nestjs/common";
import {ChatService} from "./chat.service";
import {CreateChatDto} from "./dto/createChatDto";
import {UpdateChatDto} from "./dto/updateChatDto.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiResponse} from "@nestjs/swagger";

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get('/item/:itemId')
    @ApiResponse({ status: 200, description: 'Chat has been successfully fetched.'})
    @ApiResponse({ status: 401, description: "You don't have access to create chats!"})
    async getChatsByItem(@Param('itemId') itemId: number, @Req() req) {
        const userId = req.user.userId;
        return this.chatService.findByItem(itemId, userId);
    }

    @Get()
    async getChatsForBuyer(@Req() req) {
        const userId = req.user.userId;
        return this.chatService.findChatsByBuyer(userId);
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Chat has been successfully created.'})
    @ApiResponse({ status: 401, description: "You don't have access to create chats!"})
    async create(@Body() body: CreateChatDto) {
        return await this.chatService.create(body);
    }

    @Put(':id')
    @ApiResponse({ status: 201, description: 'Message was updated.'})
    @ApiResponse({ status: 401, description: "You don't have access to edit this message!"})
    async update(@Body() body: UpdateChatDto, @Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.id;
        await this.chatService.updateMessage(id, body, userId);
    }

    @Delete(':id')
    @ApiResponse({ status: 201, description: 'Message was successfully removed.'})
    @ApiResponse({ status: 401, description: "You don't have access to remove this message!"})
    async delete(@Param('id', ParseIntPipe) id: number, @Req() request) {
        await this.chatService.delete(id);
    }
}