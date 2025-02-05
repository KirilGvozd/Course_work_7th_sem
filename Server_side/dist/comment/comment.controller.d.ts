import { CommentService } from "./comment.service";
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    findAll(id: number): Promise<{
        comments: import("../entities/comment.entity").Comment[];
        sellerName: string;
        sellerRate: number;
    }>;
    create(body: any, request: any, files: Express.Multer.File[]): Promise<import("./dto/createCommentDto").CreateCommentDto & import("../entities/comment.entity").Comment>;
    delete(request: any, id: number): Promise<import("typeorm").DeleteResult>;
}
