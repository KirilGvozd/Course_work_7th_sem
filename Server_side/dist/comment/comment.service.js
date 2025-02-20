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
const user_entity_1 = require("../entities/user.entity");
let CommentService = class CommentService {
    constructor(commentRepository, userRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }
    async findAll(sellerId) {
        const comments = await this.commentRepository.find({
            where: {
                sellerId: sellerId,
            },
            relations: ['user'],
        });
        const seller = await this.userRepository.findOne({
            where: {
                id: sellerId,
            }
        });
        return {
            comments,
            sellerName: seller.name,
            sellerRate: seller.rate,
        };
    }
    async create(body, userRole, userId) {
        if (userRole === "seller") {
            throw new common_1.UnauthorizedException("Sellers can't leave comments!");
        }
        const seller = await this.userRepository.findOne({
            where: {
                id: body.sellerId,
            }
        });
        const comment = await this.commentRepository.findOne({
            where: {
                sellerId: seller.id,
                userId: userId
            }
        });
        if (comment) {
            throw new common_1.UnauthorizedException("Вам нельзя отправлять повторно отзыв!");
        }
        seller.rates.push(+body.rate);
        await this.userRepository.save(seller);
        seller.rate = await this.countRate(body.sellerId);
        await this.userRepository.save(seller);
        body.userId = userId;
        return await this.commentRepository.save(body);
    }
    async delete(id, userId) {
        const comment = await this.commentRepository.findOne({
            where: {
                id: id,
            }
        });
        if (!comment) {
            throw new common_1.NotFoundException("Comment does not exist.");
        }
        if (comment.userId !== userId) {
            throw new common_1.UnauthorizedException("You don't have access to this comment!.");
        }
        const seller = await this.userRepository.findOne({
            where: {
                id: comment.sellerId,
            }
        });
        seller.removedRates.push(+comment.rate);
        await this.userRepository.save(seller);
        seller.rate = await this.countRate(comment.sellerId);
        await this.userRepository.save(seller);
        await this.commentRepository.delete(id);
    }
    async countRate(userId) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.rates.length === 0) {
            return 0;
        }
        if (user.rates.length === user.removedRates.length) {
            return 0;
        }
        if (user.removedRates.length === 0) {
            const totalRating = user.rates.reduce((sum, rate) => sum + rate, 0);
            return parseFloat((totalRating / user.rates.length).toFixed(2));
        }
        const totalRating = user.rates.reduce((sum, rate) => sum + rate, 0);
        const removedTotalRating = user.removedRates.reduce((sum, rate) => sum + rate, 0);
        return parseFloat(((totalRating - removedTotalRating) / (user.rates.length - user.removedRates.length)).toFixed(2));
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], CommentService);
//# sourceMappingURL=comment.service.js.map