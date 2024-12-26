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
exports.CommentController = void 0;
const common_1 = require("@nestjs/common");
const comment_service_1 = require("./comment.service");
const createCommentDto_1 = require("./dto/createCommentDto");
const pagination_dto_1 = require("../pagination.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let CommentController = class CommentController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    findAll(paginationDto, request) {
        const seller = request.seller.id;
        return this.commentService.findAll(paginationDto, seller);
    }
    create(body, request) {
        const userRole = request.user.role;
        const userId = +request.user.userId;
        return this.commentService.create(body, userRole, userId);
    }
    update(body, id, request) {
        const userId = request.user.id;
        return this.commentService.update(id, body, userId);
    }
    delete(id, request) {
        const userId = request.user.id;
        return this.commentService.delete(id, userId);
    }
};
exports.CommentController = CommentController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comments has been found.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No comments found for this seller.' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment has been leaved.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "You don't have access to leave comments!" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid comment data provided.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createCommentDto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment has been updated.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "You don't have access to this comment." }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Comment not found.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid comment data provided.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createCommentDto_1.CreateCommentDto, Number, Object]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comment has been successfully removed.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "You don't have access to delete this comment!" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Comment not found.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "delete", null);
exports.CommentController = CommentController = __decorate([
    (0, swagger_1.ApiTags)('Comments'),
    (0, common_1.Controller)('comment'),
    __metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentController);
//# sourceMappingURL=comment.controller.js.map