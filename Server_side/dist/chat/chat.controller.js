"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const createChatDto_1 = require("./dto/createChatDto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async getChatByItem(itemId, req) {
        const userId = req.user.userId;
        return this.chatService.findByItem(itemId, userId);
    }
    async getChats(req) {
        const userId = req.user.userId;
        return this.chatService.findChatsByBuyer(userId);
    }
    async create(body) {
        return await this.chatService.create(body);
    }
    async delete(id, res) {
        await this.chatService.delete(id);
        return res.status(200).json("Message was deleted successfully.");
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('/item/:itemId'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chat has been successfully fetched.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "You don't have access to access this chat!" }),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatByItem", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChats", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Chat has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "You don't have access to create chats!" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createChatDto_1.CreateChatDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Message was successfully removed.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "You don't have access to remove this message!" }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "delete", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map