import {Injectable, UnauthorizedException} from "@nestjs/common";
import {Repository} from "typeorm";
import {Comment} from "../entities/comment.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateCommentDto} from "./dto/createCommentDto";
import {PaginationDto} from "../pagination.dto";
import {DEFAULT_PAGE_SIZE} from "../utils/constants";
import {UpdateCommentDto} from "./dto/updateCommentDto";
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
        return await this.commentRepository.find({
            where: {
                sellerId: sellerId,
            },
            skip: paginationDto.skip,
            take: paginationDto.limit ?? DEFAULT_PAGE_SIZE,
        });
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

        seller.rates.push(+body.rate);
        await this.userRepository.save(seller);
        body.date = new Date().toISOString();
        body.userId = userId;
        return await this.commentRepository.save(body);
    }
}