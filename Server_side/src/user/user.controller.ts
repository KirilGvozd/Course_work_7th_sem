import {
    Body,
    Controller,
    Delete, ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Post,
    Req, Res,
    UseGuards
} from "@nestjs/common";
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/createUserDto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiExcludeEndpoint, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AddToFavouritesDto} from "./dto/addToFavouritesDto";

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createUserDto: CreateUserDto, @Req() req) {
        if (req.user.role === 'admin') {
            return await this.userService.createModerator(createUserDto);
        } else {
            return await this.userService.create(createUserDto);
        }
    }

    @Post('add-favourite')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'Item added to favourites.'})
    @ApiResponse({ status: 401, description: 'Unauthorized access.'})
    @ApiResponse({ status: 403, description: 'Seller can\'t add favourite items!'})
    @ApiResponse({ status: 404, description: 'Item not found'})
    async addToFavourites(@Body() body: AddToFavouritesDto, @Req() request, @Res() response) {
        const itemId = body.itemId;
        const userId: number = request.user.userId;

        if (request.user.role === 'seller') {
            throw new ForbiddenException("Seller can't add favourite items!");
        }

        return response.status(200).json(await this.userService.addFavouriteItem(itemId, userId));
    }

    @Get()
    @ApiExcludeEndpoint()
    @UseGuards(JwtAuthGuard)
    findOne(@Req() request) {
        const id = request.user.userId;
        return this.userService.findOne(id);
    }

    @Get('moderators')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'Moderators retrieved.'})
    @ApiResponse({ status: 401, description: 'Unauthorized access.'})
    @ApiResponse({ status: 403, description: 'Only for admins!'})
    async findModerators(@Req() request) {
        if (request.user.role !== 'admin') {
            throw new ForbiddenException("User does not have permission to perform this action");
        }
        return await this.userService.findModerators();
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
        @Res() response
    ) {
        const userId = request.user.userId;
        await this.userService.removeFromFavourites(userId, itemId);
        return response.status(200).json("Item removed from your favourites");
    }
}