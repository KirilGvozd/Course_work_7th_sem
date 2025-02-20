import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/createCommentDto";
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    findAll(id: number): Promise<{
        comments: import("../entities/comment.entity").Comment[];
        sellerName: string;
        sellerRate: number;
    }>;
    create(body: CreateCommentDto, request: any, files: Express.Multer.File[]): Promise<any>;
    delete(request: any, res: any, id: number): Promise<any>;
}
