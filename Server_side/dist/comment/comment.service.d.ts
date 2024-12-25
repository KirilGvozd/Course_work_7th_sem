import { Repository } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { CreateCommentDto } from "./dto/createCommentDto";
import { PaginationDto } from "../pagination.dto";
import { UpdateCommentDto } from "./dto/updateCommentDto";
export declare class CommentService {
    private commentRepository;
    constructor(commentRepository: Repository<Comment>);
    findAll(paginationDto: PaginationDto, sellerId: number): Promise<Comment[]>;
    create(body: CreateCommentDto, userRole: string): Promise<CreateCommentDto & Comment>;
    update(id: number, data: UpdateCommentDto, userId: number): Promise<import("typeorm").UpdateResult>;
    delete(id: number, userId: number): Promise<import("typeorm").DeleteResult>;
}
