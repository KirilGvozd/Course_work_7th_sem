import { AuthService } from './auth.service';
import { CreateUserDto } from "../user/dto/createUserDto";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { UserService } from "../user/user.service";
import { AuthDto } from "./dto/auth.dto";
import { MailService } from "../mail/mail.service";
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    private readonly userService;
    private readonly mailService;
    constructor(authService: AuthService, jwtService: JwtService, userService: UserService, mailService: MailService);
    user(req: Request): Promise<import("../entities/user.entity").User>;
    register(createUserDto: CreateUserDto, res: any): Promise<any>;
    login(authDto: AuthDto, response: Response): Promise<Response<any, Record<string, any>>>;
    logout(response: Response, request: any): Promise<Response<any, Record<string, any>>>;
}
