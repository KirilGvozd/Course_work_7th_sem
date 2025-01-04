import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {Repository} from "typeorm";
import {Comment} from "../entities/comment.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateCommentDto} from "./dto/createCommentDto";
import {PaginationDto} from "../pagination.dto";
import {User} from "../entities/user.entity";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async findAll(paginationDto: PaginationDto, sellerId: number) {
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

    async create(body: CreateCommentDto, userRole: string, userId: number) {
        if (userRole === "seller") {
            throw new UnauthorizedException("Sellers can't leave comments!");
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
            throw new UnauthorizedException("Вам нельзя отправлять повторно отзыв!");
        }

        seller.rates.push(+body.rate);
        await this.userRepository.save(seller);
        seller.rate = await this.countRate(body.sellerId);
        await this.userRepository.save(seller);
        body.date = new Date().toISOString();
        body.userId = userId;
        return await this.commentRepository.save(body);
    }

    async delete(id: number, userId: number) {
        const comment = await this.commentRepository.findOne({
            where: {
                id: id,
            }
        });

        if (!comment) {
            throw new NotFoundException("Comment does not exist.");
        }

        if (comment.userId !== userId) {
            throw new UnauthorizedException("You don't have access to this comment!.");
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

        return await this.commentRepository.delete(id);
    }

    private async countRate(userId: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
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
}