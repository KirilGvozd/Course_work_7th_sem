import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req, UploadedFiles,
    UseGuards, UseInterceptors, ValidationPipe,
} from "@nestjs/common";
import {ItemService} from "./item.service";
import {CreateItemDto} from "./dto/createItemDto";
import {PaginationDto} from "../pagination.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {UpdateItemDto} from "./dto/updateItem.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";

@ApiTags('Items')
@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Get()
    @ApiResponse({ status: 200, description: 'Successfully retrieved items list.'})
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
        @Body() body: any,
        @Req() request,
        @UploadedFiles() files: Express.Multer.File[],
    ) {

        // Преобразуем строки в числа
        const price = Number(body.price);
        const typeId: number = 1;

        if (isNaN(price) || price <= 0) {
            throw new BadRequestException("Price must be a positive number.");
        }

        if (!Number.isInteger(typeId)) {
            throw new BadRequestException("Type ID must be an integer.");
        }

        const user = {
            userId: request.user.userId,
            role: request.user.role,
        };

        const itemData = {
            name: body.name,
            description: body.description,
            price,
            prices: [],
            typeId,
            userId: user.userId,
            images: files?.map((file) => file.path) || [],
        };

        return this.itemService.create(itemData, user);
    }



    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'Item has been successfully updated.'})
    @ApiResponse({ status: 401, description: "You don't have permission to update this item!"})
    @ApiResponse({ status: 404, description: 'Item not found.'})
    update(@Param('id') id: number, @Body() body: any, @Req() request, @UploadedFiles() files: Express.Multer.File[],) {
        const price = Number(body.price);
        const typeId: number = 1;

        if (isNaN(price) || price <= 0) {
            throw new BadRequestException("Price must be a positive number.");
        }

        if (!Number.isInteger(typeId)) {
            throw new BadRequestException("Type ID must be an integer.");
        }

        const itemData = {
            name: body.name,
            description: body.description,
            price,
            prices: [],
            typeId,
            userId: request.user.userId,
            images: files?.map((file) => file.path) || [],
        };
        return this.itemService.update(id, itemData);
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