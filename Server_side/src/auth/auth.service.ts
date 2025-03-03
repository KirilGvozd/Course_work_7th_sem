import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {authenticator} from "otplib";
import * as QRCode from 'qrcode';
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

    async generate2FASecret(user: User): Promise<{ secret: string; qrCodeUrl: string }> {
        const secret = authenticator.generateSecret();

        const otpauthUrl = authenticator.keyuri(user.email, process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME, secret);

        const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

        user.twoFactorSecret = secret;
        await this.authRepository.save(user);

        return { secret, qrCodeUrl };
    }
    async verify2FACode(user: User, code: string): Promise<boolean> {
        return authenticator.verify({
            secret: user.twoFactorSecret,
            token: code,
        });
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }
}
