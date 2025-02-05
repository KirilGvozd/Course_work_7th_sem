import {
    BadRequestException,
    Body,
    Controller, Delete,
    Get,
    Param,
    Post,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {CommentService} from "./comment.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {FilesInterceptor} from "@nestjs/platform-express";

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
        @Body() body: any,
        @Req() request,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        const rate = Number(body.rate);
        const text = body.text;

        if (!text || text.trim().length === 0) {
            throw new BadRequestException('Text cannot be empty');
        }

        if (isNaN(rate) || rate < 1 || rate > 5) {
            throw new BadRequestException('Rate must be between 1 and 5');
        }

        const user = {
            userId: request.user.userId,
            role: request.user.role,
        };

        const commentData = {
            text,
            rate,
            sellerId: body.sellerId,
            userId: user.userId,
            date: new Date().toISOString(),
            attachments: files?.map((file) => file.path) || [],
        };

        return this.commentService.create(commentData, user.role, user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Req() request, @Param('id') id: number) {
        return this.commentService.delete(id, request.user.userId);
    }
}