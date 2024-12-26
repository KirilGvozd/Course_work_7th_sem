import { Repository } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { CreateCommentDto } from "./dto/createCommentDto";
import { PaginationDto } from "../pagination.dto";
import { UpdateCommentDto } from "./dto/updateCommentDto";
import { User } from "../entities/user.entity";
export declare class CommentService {
    private commentRepository;
    private userRepository;
    constructor(commentRepository: Repository<Comment>, userRepository: Repository<User>);
    findAll(paginationDto: PaginationDto, sellerId: number): Promise<Comment[]>;
    create(body: CreateCommentDto, userRole: string, userId: number): Promise<CreateCommentDto & Comment>;
    update(id: number, data: UpdateCommentDto, userId: number): Promise<import("typeorm").UpdateResult>;
    delete(id: number, userId: number): Promise<import("typeorm").DeleteResult>;
}
