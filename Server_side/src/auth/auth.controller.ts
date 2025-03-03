import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto} from "../user/dto/createUserDto";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {Request, Response} from "express";
import {UserService} from "../user/user.service";
import {AuthDto} from "./dto/auth.dto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
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
  @UseGuards(JwtAuthGuard)
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
  @ApiResponse({ status: 200, description: 'User has been successfully registered.'})
  @ApiResponse({ status: 400, description: 'Invalid registration data or user already exists.'})
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() res
  ) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException("User with this email already exists!");
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
    return res.status(201).json(await this.userService.create(createUserDto));
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'Successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(
      @Body() authDto: AuthDto,
      @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(authDto.email, authDto.password);

    if (!user) {
      throw new BadRequestException('Invalid credentials!');
    }

    if (user.isTwoFactorEnabled) {
      return response.status(200).json({
        message: '2FA required',
        userId: user.id,
      });
    }

    const token = await this.authService.generateToken(user);
    response.cookie('jwt', token, { httpOnly: true });

    return response.status(200).json({
      message: 'Login successful',
      userRole: user.role,
      accessToken: token,
    });
  }

  @Post('logout')
  @ApiResponse({ status: 200, description: 'Successfully logged out.'})
  @ApiResponse({ status: 401, description: 'You are not logged in.'})
  async logout(@Res({passthrough: true}) response: Response, @Req() request) {
    if (!request.cookies.jwt) {
      throw new UnauthorizedException("You're not logged in!");
    }
    response.clearCookie("jwt");
    return response.status(200).json({ message: "Cookie has been cleared" });
  }

  @Post('verify-login-2fa')
  @ApiResponse({ status: 200, description: '2FA code verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid 2FA code.' })
  async verifyLogin2FA(
      @Body() body: { userId: number; code: string },
      @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.findOne({ id: body.userId });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await this.authService.verify2FACode(user, body.code);
    if (!isValid) {
      throw new BadRequestException('Invalid 2FA code');
    }

    const token = await this.authService.generateToken(user);
    response.cookie('jwt', token, { httpOnly: true });

    return response.status(200).json({
      message: 'Login successful',
      userRole: user.role,
      accessToken: token,
    });
  }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: '2FA has been successfully enabled.' })
  @ApiResponse({ status: 401, description: 'Not authenticated.' })
  async enable2FA(@Req() req: Request) {
    const cookie = req.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie, { secret: process.env.JWT_SECRET });
    const user = await this.userService.findOne(data.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { secret, qrCodeUrl } = await this.authService.generate2FASecret(user);
    return { secret, qrCodeUrl };
  }

  @Post('verify-2fa')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: '2FA code verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid 2FA code.' })
  async verify2FA(@Body() body: { code: string }, @Req() req: Request) {
    const cookie = req.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie, { secret: process.env.JWT_SECRET });
    const user = await this.userService.findOne(data.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await this.authService.verify2FACode(user, body.code);
    if (!isValid) {
      throw new BadRequestException('Invalid 2FA code');
    }

    await this.userService.update(user.id, { isTwoFactorEnabled: true, twoFactorSecret: user.twoFactorSecret });

    return { message: '2FA has been successfully enabled' };
  }

  @Post('disable-2fa')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: '2FA has been successfully disabled.' })
  @ApiResponse({ status: 401, description: 'Not authenticated.' })
  async disable2FA(@Req() req: Request) {
    const cookie = req.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie, { secret: process.env.JWT_SECRET });
    const user = await this.userService.findOne(data.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.userService.update(user.id, { isTwoFactorEnabled: false, twoFactorSecret: null });
    return { message: '2FA has been successfully disabled' };
  }
}
