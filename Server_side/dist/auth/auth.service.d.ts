import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private readonly authRepository;
    private readonly jwtService;
    constructor(authRepository: Repository<User>, jwtService: JwtService);
    findOne(condition: any): Promise<User>;
    generateTokens(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRefreshToken(userId: number, refreshToken: string): Promise<void>;
    validateRefreshToken(userId: number, refreshToken: string): Promise<boolean>;
    validateGoogleUser(profile: {
        email: string;
        name: string;
    }): Promise<User>;
}
