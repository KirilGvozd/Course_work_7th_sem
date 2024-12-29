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

        console.log(body);

        const seller = await this.userRepository.findOne({
            where: {
                id: body.sellerId,
            }
        });

        seller.rates.push(+body.rate);
        await this.userRepository.save(seller);
        seller.rate = await this.countRate(body.sellerId);
        await this.userRepository.save(seller);
        body.date = new Date().toISOString();
        body.userId = userId;
        return await this.commentRepository.save(body);
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

        const totalRating = user.rates.reduce((sum, rate) => sum + rate, 0);
        return parseFloat((totalRating / user.rates.length).toFixed(2));
    }
}