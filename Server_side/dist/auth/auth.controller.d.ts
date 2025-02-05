import { AuthService } from './auth.service';
import { CreateUserDto } from "../user/dto/createUserDto";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { UserService } from "../user/user.service";
import { AuthDto } from "./dto/auth.dto";
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    private readonly userService;
    constructor(authService: AuthService, jwtService: JwtService, userService: UserService);
    user(req: Request): Promise<import("../entities/user.entity").User>;
    register(createUserDto: CreateUserDto): Promise<void>;
    login(authDto: AuthDto, response: Response): Promise<{
        message: string;
        accessToken: string;
    }>;
    logout(response: Response, request: any): Promise<{
        message: string;
    }>;
}
