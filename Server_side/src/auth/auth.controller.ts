import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto} from "../user/dto/createUserDto";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {Request, Response} from "express";
import {AuthGuard} from "@nestjs/passport";
import {UserService} from "../user/user.service";
import {AuthDto} from "./dto/auth.dto";
import {ApiExcludeEndpoint, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "./jwt-auth.guard";

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
      console.log('Auth check request received');
      const cookie = req.cookies['jwt'];
      console.log('JWT cookie:', cookie ? 'present' : 'missing');

      const data = await this.jwtService.verifyAsync(cookie, { secret: process.env.JWT_SECRET });
      console.log(data);
      console.log('JWT verified:', data);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.authService.findOne({id: data.id});
      console.log('User found:', user ? 'yes' : 'no');

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (err) {
      console.error('Auth check error:', err);
      throw new UnauthorizedException()
    }
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'User has been successfully registered.'})
  @ApiResponse({ status: 400, description: 'Invalid registration data or user already exists.'})
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({passthrough: true}) response: Response
  ) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException("User with this email already exists!");
    }
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

    const tokens = await this.authService.generateTokens(user);

    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);

    response.cookie("jwt", tokens.accessToken, { httpOnly: true },);
    response.cookie("refreshToken", tokens.refreshToken, { httpOnly: true, path: '/auth/refresh' });

    return {
      message: "Login successful",
      accessToken: tokens.accessToken,
    };
  }

  @Post('refresh')
  @ApiResponse({ status: 201, description: 'Token refreshed successfully.'})
  @ApiResponse({ status: 401, description: 'Invalid refresh token.'})
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException("No refresh token found.");
    }

    try {
      const data = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });

      const isValid = await this.authService.validateRefreshToken(data.id, refreshToken);
      if (!isValid) {
        throw new UnauthorizedException("Invalid refresh token.");
      }

      const newAccessToken = await this.jwtService.signAsync(
          { id: data.id, role: data.role },
          { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_TOKEN_EXPIRE }
      );

      res.cookie("jwt", newAccessToken, { httpOnly: true, sameSite: "none", secure: false });
      return { message: "Token refreshed successfully" };
    } catch (err) {
      throw new UnauthorizedException("Invalid refresh token.");
    }
  }

  @Post('logout')
  @ApiResponse({ status: 200, description: 'Successfully logged out.'})
  @ApiResponse({ status: 401, description: 'You are not logged in.'})
  async logout(@Res({passthrough: true}) response: Response, @Req() request) {
    if (!request.cookies.jwt) {
      throw new UnauthorizedException("You're not logged in!");
    }
    response.clearCookie("jwt");
    return {message: "Success"};
  }

  @Get('google')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
  }

  @Get('google/callback')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;

    const tokens = await this.authService.generateTokens(user);

    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);

    res.cookie("jwt", tokens.accessToken, { httpOnly: true, sameSite: "none", secure: false });
    res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true, path: '/auth/refresh', sameSite: "none", secure: false });

    res.redirect('http://localhost:3000');
  }
}
