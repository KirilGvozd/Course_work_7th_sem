import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Req, Res,
    UseGuards
} from "@nestjs/common";
import {ChatService} from "./chat.service";
import {CreateChatDto} from "./dto/createChatDto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiResponse} from "@nestjs/swagger";

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get('/item/:itemId')
    @ApiResponse({ status: 200, description: 'Chat has been successfully fetched.'})
    @ApiResponse({ status: 401, description: "You don't have access to access this chat!"})
    async getChatByItem(@Param('itemId') itemId: number, @Req() req) {
        const userId = req.user.userId;
        return this.chatService.findByItem(itemId, userId);
    }

    @Get()
    async getChats(@Req() req) {
        const userId = req.user.userId;
        return this.chatService.findChatsByBuyer(userId);
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Chat has been successfully created.'})
    @ApiResponse({ status: 401, description: "You don't have access to create chats!"})
    async create(@Body() body: CreateChatDto) {
        return await this.chatService.create(body);
    }

    @Delete(':id')
    @ApiResponse({ status: 201, description: 'Message was successfully removed.'})
    @ApiResponse({ status: 401, description: "You don't have access to remove this message!"})
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res) {
        await this.chatService.delete(id);
        return res.status(200).json("Message was deleted successfully.");
    }
}