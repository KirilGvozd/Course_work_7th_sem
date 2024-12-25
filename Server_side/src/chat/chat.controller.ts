import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards} from "@nestjs/common";
import {ChatService} from "./chat.service";
import {CreateChatDto} from "./dto/createChatDto";
import {PaginationDto} from "../pagination.dto";
import {UpdateChatDto} from "./dto/updateChatDto.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiResponse} from "@nestjs/swagger";

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get()
    @ApiResponse({ status: 200, description: 'Your chats has been found.'})
    @ApiResponse({ status: 401, description: "You don't have access to this chats."})
    async findAll(@Query() paginationDto: PaginationDto, @Req() request) {
        const userId = request.user.id;
        return await this.chatService.findAll(paginationDto, userId);
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Chat has been found.'})
    @ApiResponse({ status: 401, description: "You don't have access to this chat."})
    async findChat(@Req() request, @Param('id', ParseIntPipe) id: number) {
        const userId = request.user.id;
        const receiverId = request.receiver.id;
        return await this.chatService.findChat(id, userId, receiverId);
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Chat has been successfully created.'})
    @ApiResponse({ status: 401, description: "You don't have access to create chats!"})
    async create(@Body() body: CreateChatDto) {
        await this.chatService.create(body);
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
        const userId = request.user.id;
        await this.chatService.delete(id, userId);
    }
}