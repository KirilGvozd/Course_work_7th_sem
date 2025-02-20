import {
    BadRequestException,
    Body,
    Controller, Delete,
    Get,
    Param,
    Post,
    Req, Res,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {CommentService} from "./comment.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {FilesInterceptor} from "@nestjs/platform-express";
import {CreateCommentDto} from "./dto/createCommentDto";

@ApiTags('Comments')
@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Comments has been found.'})
    @ApiResponse({ status: 404, description: 'No comments found for this seller.'})
    findAll(@Param('id') id: number) {
        return this.commentService.findAll(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('images'))
    async create(
        @Body() body: CreateCommentDto,
        @Req() request,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        if (!body.text || body.text.trim().length === 0) {
            throw new BadRequestException('Text cannot be empty');
        }

        if (body.rate < 1 || body.rate > 5) {
            throw new BadRequestException('Rate must be between 1 and 5');
        }

        const user = {
            userId: request.user.userId,
            role: request.user.role,
        };

        const commentData = {
            text: body.text,
            rate: body.rate,
            sellerId: body.sellerId,
            date: new Date().toISOString(),
            attachments: files?.map((file) => file.path) || [],
        };

        return this.commentService.create(commentData, user.role, user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Req() request, @Res() res, @Param('id') id: number) {
        await this.commentService.delete(id, request.user.userId);
        return res.status(200).json({ message: "Comment removed successfully." });
    }
}