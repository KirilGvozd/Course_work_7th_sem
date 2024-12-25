import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query, Req, UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {CommentService} from "./comment.service";
import {CreateCommentDto} from "./dto/createCommentDto";
import {PaginationDto} from "../pagination.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiResponse, ApiTags} from "@nestjs/swagger";

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
    @ApiResponse({ status: 201, description: 'Comment has been leaved.'})
    @ApiResponse({ status: 401, description: "You don't have access to leave comments!"})
    @ApiResponse({ status: 400, description: 'Invalid comment data provided.'})
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Body() body: CreateCommentDto, @Req() request) {
        const userRole = request.user.role;
        return this.commentService.create(body, userRole);
    }

    @Put(':id')
    @ApiResponse({ status: 201, description: 'Comment has been updated.'})
    @ApiResponse({ status: 401, description: "You don't have access to this comment."})
    @ApiResponse({ status: 404, description: 'Comment not found.'})
    @ApiResponse({ status: 400, description: 'Invalid comment data provided.'})
    @UseGuards(JwtAuthGuard)
    update(@Body() body: CreateCommentDto, @Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.id;
        return this.commentService.update(id, body, userId);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Comment has been successfully removed.'})
    @ApiResponse({ status: 401, description: "You don't have access to delete this comment!"})
    @ApiResponse({ status: 404, description: 'Comment not found.'})
    @UseGuards(JwtAuthGuard)
    delete(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId = request.user.id;
        return this.commentService.delete(id, userId);
    }
}