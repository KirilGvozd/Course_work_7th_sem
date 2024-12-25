import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards} from "@nestjs/common";
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/createUserDto";
import {PaginationDto} from "../pagination.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

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

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'User profile has been found.'})
    @ApiResponse({ status: 401, description: 'Unauthorized access.'})
    @ApiResponse({ status: 404, description: 'User not found.'})
    findOne(@Req() request) {
        const id = request.user.id;
        return this.userService.findOne(id);
    }

    @Get('favourites/:userId')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'User favourites found.'})
    @ApiResponse({ status: 401, description: 'Unauthorized access.'})
    @ApiResponse({ status: 404, description: 'User not found.'})
    findFavourites(@Req() request, @Param('userId') userId: number) {
        return this.userService.findFavourites(userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ status: 200, description: 'User has been successfully deleted.'})
    @ApiResponse({ status: 401, description: 'Unauthorized access.'})
    @ApiResponse({ status: 404, description: 'User not found.'})
    delete(@Req() request) {
        const id = request.user.id;
        return this.userService.delete(id);
    }
}