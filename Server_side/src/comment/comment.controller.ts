import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {CommentService} from "./comment.service";
import {CreateCommentDto} from "./dto/createCommentDto";
import {PaginationDto} from "../pagination.dto";
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
    findAll(@Query() paginationDto: PaginationDto, @Req() request, @Param('id') id: number) {
        return this.commentService.findAll(paginationDto, id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('images'))  // Обрабатываем несколько файлов
    async create(
        @Body() body: any,  // Получаем тело запроса
        @Req() request,    // Получаем данные о пользователе
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        // Проверяем и преобразуем данные
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

        console.log(files);
        const commentData = {
            text,
            rate,
            sellerId: body.sellerId, // Получаем ID продавца
            userId: user.userId,
            date: new Date().toISOString(),  // Дата создания комментария
            attachments: files?.map((file) => file.path) || [],  // Добавляем пути файлов, если они есть
        };

        console.log('Comment data:', commentData);

        // Передаем данные в сервис
        return this.commentService.create(commentData, user.role, user.userId);
    }
}