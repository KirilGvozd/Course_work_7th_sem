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
    register(createUserDto: CreateUserDto, response: Response): Promise<void>;
    login(authDto: AuthDto, response: Response): Promise<{
        message: string;
        accessToken: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        message: string;
    }>;
    logout(response: Response, request: any): Promise<{
        message: string;
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: Request, res: Response): Promise<void>;
}
