import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/createCommentDto";
import { PaginationDto } from "../pagination.dto";
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    findAll(paginationDto: PaginationDto, request: any, id: number): Promise<{
        comments: import("../entities/comment.entity").Comment[];
        sellerName: string;
        sellerRate: number;
    }>;
    create(body: any, request: any, files: Express.Multer.File[]): Promise<CreateCommentDto & import("../entities/comment.entity").Comment>;
}
