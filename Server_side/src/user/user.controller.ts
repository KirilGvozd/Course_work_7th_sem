import {
    Body,
    Controller,
    Delete, ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/createUserDto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import {AddToFavouritesDto} from "./dto/addToFavouritesDto";

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiResponse({ status: 201, description: 'User has been successfully created.'})
    @ApiResponse({ status: 400, description: 'Invalid user data provided or user already exists.'})
    async create(@Body() createUserDto: CreateUserDto) {
        await this.userService.create(createUserDto);
    }

    @Post('add-favourite')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 201, description: 'Item added to favourites.'})
    @ApiResponse({ status: 401, description: 'Unauthorized access.'})
    @ApiResponse({ status: 403, description: 'Seller can\'t add favourite items!'})
    @ApiResponse({ status: 404, description: 'Item not found'})
    async addToFavourites(@Body() body: AddToFavouritesDto, @Req() request) {
        const itemId = body.itemId;
        const userId: number = request.user.userId;

        if (request.user.role === 'seller') {
            throw new ForbiddenException("Seller can't add favourite items!");
        }

        return await this.userService.addFavouriteItem(itemId, userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'User profile has been found.'})
    @ApiResponse({ status: 401, description: 'Unauthorized access.'})
    @ApiResponse({ status: 404, description: 'User not found.'})
    findOne(@Req() request) {
        const id = request.user.userId;
        console.log(id);
        return this.userService.findOne(id);
    }

    @Get('favourites')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'User favourites found.'})
    @ApiResponse({ status: 401, description: 'Unauthorized access.'})
    @ApiResponse({ status: 404, description: 'User not found.'})
    async findFavourites(@Req() request) {
        const userId: number = request.user.userId;
        const favourites = await this.userService.findFavourites(userId);

        if (!favourites || favourites.length === 0) {
            throw new NotFoundException('No favourites found for this user.');
        }

        return favourites;
    }

    @Delete('remove-favourite/:id')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'Item has been successfully deleted.'})
    @ApiResponse({ status: 401, description: 'Unauthorized access.'})
    @ApiResponse({ status: 404, description: 'User or item not found.'})
    async removeFromFavourites(
        @Param('id') itemId: number,
        @Req() request,
    ) {
        const userId = request.user.userId;
        return await this.userService.removeFromFavourites(userId, itemId);
    }
}