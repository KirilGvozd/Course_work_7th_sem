import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

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

    async generateToken(user: User) {
        return await this.jwtService.signAsync(
            {id: user.id, role: user.role},
            {secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_TOKEN_EXPIRE}
        );
    }

    async validateGoogleUser(profile: { email: string; name: string }): Promise<User> {
        let user = await this.findOne({ email: profile.email });

        if (!user) {
            user = this.authRepository.create({
                email: profile.email,
                name: profile.name,
                password: bcrypt.hash(Math.random().toString(36), 12).toString(),
            });
            await this.authRepository.save(user);
        }

        return user;
    }
}
