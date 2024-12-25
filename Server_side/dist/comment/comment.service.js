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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const comment_entity_1 = require("../entities/comment.entity");
const typeorm_2 = require("@nestjs/typeorm");
const constants_1 = require("../utils/constants");
let CommentService = class CommentService {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async findAll(paginationDto, sellerId) {
        return await this.commentRepository.find({
            where: {
                sellerId: sellerId,
            },
            skip: paginationDto.skip,
            take: paginationDto.limit ?? constants_1.DEFAULT_PAGE_SIZE,
        });
    }
    async create(body, userRole) {
        if (userRole === "seller") {
            throw new common_1.UnauthorizedException("Sellers can't leave comments!");
        }
        body.date = new Date().toISOString();
        return await this.commentRepository.save(body);
    }
    async update(id, data, userId) {
        const comment = await this.commentRepository.findOne({
            where: {
                userId: userId,
            }
        });
        if (!comment) {
            throw new common_1.UnauthorizedException("You don't have access to this comment.");
        }
        return await this.commentRepository.update(id, data);
    }
    async delete(id, userId) {
        const comment = await this.commentRepository.findOne({
            where: {
                userId: userId,
            }
        });
        if (!comment) {
            throw new common_1.UnauthorizedException("You don't have access to this comment.");
        }
        return await this.commentRepository.delete(id);
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], CommentService);
//# sourceMappingURL=comment.service.js.map