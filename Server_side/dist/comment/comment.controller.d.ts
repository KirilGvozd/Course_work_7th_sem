import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/createCommentDto";
import { PaginationDto } from "../pagination.dto";
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    findAll(paginationDto: PaginationDto, request: any): Promise<import("../entities/comment.entity").Comment[]>;
    create(body: CreateCommentDto, request: any): Promise<CreateCommentDto & import("../entities/comment.entity").Comment>;
    update(body: CreateCommentDto, id: number, request: any): Promise<import("typeorm").UpdateResult>;
    delete(id: number, request: any): Promise<import("typeorm").DeleteResult>;
}
