import {
    Body,
    Controller,
    Delete, ForbiddenException,
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
    @ApiQuery({ name: 'attributes', required: false, type: String, description: 'JSON string of attributes filter' })
    findAll(
        @Query() paginationDto: PaginationDto,
        @Query('typeId') typeId?: number,
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
        @Query('sellerId') sellerId?: number,
        @Query('attributes') attributes?: string
    ) {
        const attributeFilters = attributes ? JSON.parse(attributes) : {};
        return this.itemService.findAll(paginationDto, { categoryId: typeId, minPrice, maxPrice, sellerId, attributes: attributeFilters });
    }

    @Get('reserved')
    @ApiResponse({ status: 200, description: 'Your reserved items has been successfully retrieved.'})
    @ApiResponse({ status: 401, description: "You don't have permission to retrieve this!"})
    @ApiResponse({ status: 403, description: "You don't have rights to retrieve this!"})
    @UseGuards(JwtAuthGuard)
    async getReservedItems(@Req() req) {
        if (req.user.role === 'buyer') {
            return await this.itemService.getReservedItems(req.user.userId);
        } else {
            throw new ForbiddenException("You dont have rights to make or store reservations!");
        }
    }

    @Get('pending-approval')
    @ApiResponse({ status: 200, description: 'Items that are pending approval has been successfully retrieved.'})
    @ApiResponse({ status: 401, description: "You don't have permission to retrieve this!"})
    @ApiResponse({ status: 403, description: "You don't have rights to retrieve this!"})
    @UseGuards(JwtAuthGuard)
    async getItemsPendingApproval(@Req() req) {
        if (req.user.role !== 'seller') {
            throw new ForbiddenException("You don't have rights to watch pending approvals!");
        }
        return await this.itemService.getItemsPendingApproval(req.user.userId);
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

        body.categoryId = Number(body.categoryId);
        body.price = Number(body.price);
        body.userId = user.userId;

        body.images = files?.map((file) => file.path) || []

        return this.itemService.create(body, user);
    }

    @Post('reserve/:id')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'Item successfully reserved.'})
    @ApiResponse({ status: 401, description: 'Unauthorized access.'})
    @ApiResponse({ status: 403, description: 'You don\'t have rights to reserve items!'})
    @ApiResponse({ status: 404, description: 'Item not found.'})
    async reserve(@Param('id') itemId: number, @Req() req) {
        if (req.user.role === 'buyer') {
            return await this.itemService.reserveItem(itemId, req.user.userId);
        } else {
            throw new ForbiddenException("You don't have rights to reserve items!");
        }
    }

    @Delete('reserve/:id')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'Item successfully removed from reserved list.'})
    @ApiResponse({ status: 401, description: 'Unauthorized access.'})
    @ApiResponse({ status: 403, description: 'You don\'t have rights to reserve items!'})
    @ApiResponse({ status: 404, description: 'Item not found.'})
    async deleteReservation(@Param('id') itemId: number, @Req() req) {
        if (req.user.role === 'buyer') {
            return await this.itemService.removeReservation(itemId, req.user.userId);
        } else {
            throw new ForbiddenException("You don't have rights to remove reserved items!");
        }
    }

    @Post('approve/:id')
    @ApiResponse({ status: 200, description: 'Reservation has been successfully approved.'})
    @ApiResponse({ status: 401, description: "You don't have permission to approve this reservation!"})
    @ApiResponse({ status: 403, description: "You don't have rights to approve this reservation!"})
    @UseGuards(JwtAuthGuard)
    async approveReservation( @Param('id') itemId: number, @Req() req) {
        if (req.user.role !== 'seller') {
            throw new ForbiddenException("You don't have rights to approve reservations!");
        }
        return await this.itemService.approveReservation(itemId, req.user.userId);
    }

    @Post('reject/:id')
    @ApiResponse({ status: 200, description: 'Reservation has been successfully rejected.'})
    @ApiResponse({ status: 401, description: "You don't have permission to reject this reservation!"})
    @ApiResponse({ status: 403, description: "You don't have rights to reject this reservation!"})
    @UseGuards(JwtAuthGuard)
    async rejectReservation(@Param('id') itemId: number, @Req() req) {
        if (req.user.role !== 'seller') {
            throw new ForbiddenException("You don't have rights to reject reservations!");
        }
        return await this.itemService.rejectReservation(itemId, req.user.userId);
    }

    @Put(':id')
    @ApiResponse({ status: 200, description: 'Item has been successfully updated.'})
    @ApiResponse({ status: 401, description: "You don't have permission to edit this item!"})
    @ApiResponse({ status: 403, description: "You don't have rights to edit this item!"})
    @ApiResponse({ status: 404, description: 'Item not found.'})
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('images'))
    async update(
        @Param('id') id: number,
        @Body() body: UpdateItemDto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() request,
    ) {
        if (request.user.role !== 'seller') {
            throw new ForbiddenException("You don't have rights to edit items!");
        }
        const existingImages = await this.itemService.retrieveExistingImages(id);
        const images = files ? files.map((file) => file.path) : [];

        body.images = [...existingImages, ...images];

        return await this.itemService.update(id, body, request.user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'Item has been successfully deleted.'})
    @ApiResponse({ status: 401, description: "You don't have permission to delete this item!"})
    @ApiResponse({ status: 403, description: "You don't have rights to delete this item!"})
    @ApiResponse({ status: 404, description: 'Item not found.'})
    delete(@Param('id') id: number, @Req() request) {
        if (request.user.role !== 'seller') {
            throw new ForbiddenException("You don't have rights to delete the item!");
        }

        const userId = request.user.id;

        return this.itemService.delete(id, userId);
    }
}