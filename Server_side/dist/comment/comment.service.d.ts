import { Repository } from "typeorm";
import { Comment } from "../entities/comment.entity";
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
    create(body: any, userRole: string, userId: number): Promise<any>;
    delete(id: number, userId: number): Promise<void>;
    private countRate;
}
