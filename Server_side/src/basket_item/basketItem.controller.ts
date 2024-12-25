import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Req, UnauthorizedException,
    UseGuards
} from "@nestjs/common";
import {BasketItemService} from "./basketItem.service";
import {CreateBasketItemDto} from "./dto/createBasketItemDto";
import {PaginationDto} from "../pagination.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Basket Items')
@UseGuards(JwtAuthGuard)
@Controller('basketItem')
export class BasketItemController {
    constructor(private readonly basketItemService: BasketItemService) {}

    @Get()
    @ApiResponse({ status: 200, description: 'Your items from cart has been found'})
    @ApiResponse({ status: 401, description: "You don't have access to this cart."})
    async findAll(@Query() paginationDto: PaginationDto, @Req() request) {
        const userId: number = request.user.userId;
        return await this.basketItemService.findAll(paginationDto, userId);
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Item has been successfully added to your cart' })
    @ApiResponse({ status: 401, description: "You don't have access to add items to cart."})
    async create(@Body() body: CreateBasketItemDto, @Req() request) {
        body.userId = request.user.userId;
        if (request.user.role === 'seller') {
            throw new UnauthorizedException("Seller don't have access to cart!");
        }
        await this.basketItemService.create(body);
    }

    @ApiResponse({ status: 201, description: 'Item has been successfully removed from your cart' })
    @ApiResponse({ status: 401, description: "You don't have access to this card!"})
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() request) {
        const userId: number = request.user.userId;
        await this.basketItemService.delete(id, userId);
    }
}