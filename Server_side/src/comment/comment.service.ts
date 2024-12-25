import {Injectable, UnauthorizedException} from "@nestjs/common";
import {Repository} from "typeorm";
import {Comment} from "../entities/comment.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateCommentDto} from "./dto/createCommentDto";
import {PaginationDto} from "../pagination.dto";
import {DEFAULT_PAGE_SIZE} from "../utils/constants";
import {UpdateCommentDto} from "./dto/updateCommentDto";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>
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

    async create(body: CreateCommentDto, userRole: string) {
        if (userRole === "seller") {
            throw new UnauthorizedException("Sellers can't leave comments!");
        }

        body.date = new Date().toISOString();
        return await this.commentRepository.save(body);
    }

    async update(id: number, data: UpdateCommentDto, userId: number) {
        const comment = await this.commentRepository.findOne({
            where: {
                userId: userId,
            }
        });

        if (!comment) {
            throw new UnauthorizedException("You don't have access to this comment.");
        }

        return await this.commentRepository.update(id, data);
    }

    async delete(id: number, userId: number) {
        const comment = await this.commentRepository.findOne({
            where: {
                userId: userId,
            }
        });

        if (!comment) {
            throw new UnauthorizedException("You don't have access to this comment.");
        }

        return await this.commentRepository.delete(id);
    }
}