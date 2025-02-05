import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private readonly authRepository;
    private readonly jwtService;
    constructor(authRepository: Repository<User>, jwtService: JwtService);
    findOne(condition: any): Promise<User>;
    generateToken(user: User): Promise<string>;
    validateGoogleUser(profile: {
        email: string;
        name: string;
    }): Promise<User>;
}
