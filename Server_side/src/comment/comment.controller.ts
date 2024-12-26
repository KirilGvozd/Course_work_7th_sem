import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query, Req, UploadedFiles, UseGuards, UseInterceptors,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {CommentService} from "./comment.service";
import {CreateCommentDto} from "./dto/createCommentDto";
import {PaginationDto} from "../pagination.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";

@ApiTags('Comments')
@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get()
    @ApiResponse({ status: 200, description: 'Comments has been found.'})
    @ApiResponse({ status: 404, description: 'No comments found for this seller.'})
    findAll(@Query() paginationDto: PaginationDto, @Req() request) {
        const seller = request.seller.id;
        return this.commentService.findAll(paginationDto, seller);
    }

    @Post()
    @UseInterceptors(FileInterceptor('images'))
    @ApiResponse({ status: 201, description: 'Comment has been leaved.'})
    @ApiResponse({ status: 401, description: "You don't have access to leave comments!"})
    @ApiResponse({ status: 400, description: 'Invalid comment data provided.'})
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Body() body: CreateCommentDto, @Req() request, @UploadedFiles() files: Express.Multer.File[]) {
        const userRole = request.user.role;
        const userId: number = +request.user.userId;
        body.attachments = files?.map((file) => file.path) || [];
        return this.commentService.create(body, userRole, userId);
    }
}