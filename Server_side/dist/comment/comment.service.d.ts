import { Repository } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { CreateCommentDto } from "./dto/createCommentDto";
import { User } from "../entities/user.entity";
export declare class CommentService {
    private commentRepository;
    private userRepository;
    constructor(commentRepository: Repository<Comment>, userRepository: Repository<User>);
    findAll(sellerId: number): Promise<{
        comments: Comment[];
        sellerName: string;
        sellerRate: number;
    }>;
    create(body: CreateCommentDto, userRole: string, userId: number): Promise<CreateCommentDto & Comment>;
    delete(id: number, userId: number): Promise<import("typeorm").DeleteResult>;
    private countRate;
}
