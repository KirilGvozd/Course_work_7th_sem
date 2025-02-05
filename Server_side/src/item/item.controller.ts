import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req, UploadedFiles,
    UseGuards, UseInterceptors,
} from "@nestjs/common";
import {ItemService} from "./item.service";
import {PaginationDto} from "../pagination.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FilesInterceptor} from "@nestjs/platform-express";
import {CreateItemDto} from "./dto/createItemDto";
import {UpdateItemDto} from "./dto/updateItem.dto";

@ApiTags('Items')
@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Get()
    @ApiResponse({ status: 200, description: 'Successfully retrieved items list.'})
    @ApiQuery({ name: 'typeId', required: false, type: Number })
    @ApiQuery({ name: 'minPrice', required: false, type: Number })
    @ApiQuery({ name: 'maxPrice', required: false, type: Number })
    @ApiQuery({ name: 'sellerId', required: false, type: Number })
    findAll(@Query() paginationDto: PaginationDto, @Query('typeId') typeId?: number, @Query('minPrice') minPrice?: number,
            @Query('maxPrice') maxPrice?: number, @Query('sellerId') sellerId?: number) {
        return this.itemService.findAll(paginationDto, { typeId, minPrice, maxPrice, sellerId });
    }


    @Get(':id')
    @ApiResponse({ status: 200, description: 'Item has been found.'})
    @ApiResponse({ status: 404, description: 'Item not found.'})
    findOne(@Param('id') id: number) {
        return this.itemService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('images'))
    async create(
        @Body() body: CreateItemDto,
        @Req() request,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        const user = {
            userId: request.user.userId,
            role: request.user.role,
        };

        body.images = files?.map((file) => file.path) || []

        return this.itemService.create(body, user);
    }


    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('images'))
    async update(
        @Param('id') id: number,
        @Body() body: UpdateItemDto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() request,
    ) {
        const existingImages = await this.itemService.retrieveExistingImages(id);
        const images = files ? files.map((file) => file.path) : [];

        body.images = [...existingImages, ...images];

        return await this.itemService.update(id, body, request.user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'Item has been successfully deleted.'})
    @ApiResponse({ status: 401, description: "You don't have permission to delete this item!"})
    @ApiResponse({ status: 404, description: 'Item not found.'})
    delete(@Param('id') id: number, @Req() request) {
        const userId = request.user.id;

        return this.itemService.delete(id, userId);
    }
}