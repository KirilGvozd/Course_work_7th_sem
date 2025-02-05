import {BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException,} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto} from "../user/dto/createUserDto";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {Request, Response} from "express";
import {UserService} from "../user/user.service";
import {AuthDto} from "./dto/auth.dto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly jwtService: JwtService,
      private readonly userService: UserService,
  ) {}

  @Get('user')
  @ApiResponse({ status: 200, description: 'User data retrieved successfully.'})
  @ApiResponse({ status: 401, description: 'Not authenticated.'})
  async user(@Req() req: Request) {

    try {

      const cookie = req.cookies['jwt'];

      const data = await this.jwtService.verifyAsync(cookie, {secret: process.env.JWT_SECRET});

      return await this.authService.findOne({id: data.id});

    } catch (error) {
      throw new UnauthorizedException("User not found");
    }
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'User has been successfully registered.'})
  @ApiResponse({ status: 400, description: 'Invalid registration data or user already exists.'})
  async register(
    @Body() createUserDto: CreateUserDto
  ) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException("User with this email already exists!");
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
    await this.userService.create(createUserDto);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'Successfully logged in.'})
  @ApiResponse({ status: 401, description: 'Invalid credentials.'})
  async login(
    @Body() authDto: AuthDto,
    @Res({passthrough: true}) response: Response
  ) {
    const user = await this.userService.findByEmail(authDto.email);

    if (!user || !await bcrypt.compare(authDto.password, user.password)) {
      throw new BadRequestException('Invalid credentials!');
    }

    const token = await this.authService.generateToken(user);

    response.cookie("jwt", token, { httpOnly: true },);

    return {
      message: "Login successful",
      accessToken: token,
    };
  }

  @Post('logout')
  @ApiResponse({ status: 200, description: 'Successfully logged out.'})
  @ApiResponse({ status: 401, description: 'You are not logged in.'})
  async logout(@Res({passthrough: true}) response: Response, @Req() request) {
    if (!request.cookies.jwt) {
      throw new UnauthorizedException("You're not logged in!");
    }
    response.clearCookie("jwt");
    return { message: "Cookie has been cleared" };
  }
}
