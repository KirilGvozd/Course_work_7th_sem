import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {Repository} from "typeorm";
import * as bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly authRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async findOne(condition: any) {
        return this.authRepository.findOne({
            where: condition,
        });
    }

    async generateTokens(user: User) {
        const accessToken = await this.jwtService.signAsync(
            { id: user.id, role: user.role },
            { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_TOKEN_EXPIRE }
        );

        const refreshToken = await this.jwtService.signAsync(
            { id: user.id, role: user.role },
            { secret: process.env.JWT_REFRESH_SECRET, expiresIn: process.env.JWT_REFRESH_EXPIRE }
        );

        return {accessToken, refreshToken};
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
        await this.authRepository.update(userId, { refreshToken: hashedRefreshToken });
    }

    async validateRefreshToken(userId: number, refreshToken: string): Promise<boolean> {
        const user = await this.findOne({ id: userId });
        if (!user || !user.refreshToken) {
            return false;
        }
        return bcrypt.compare(refreshToken, user.refreshToken);
    }

    async validateGoogleUser(profile: { email: string; name: string }): Promise<User> {
        let user = await this.findOne({ email: profile.email });

        if (!user) {
            user = this.authRepository.create({
                email: profile.email,
                name: profile.name,
                password: '',
            });
            await this.authRepository.save(user);
        }

        return user;
    }
}
