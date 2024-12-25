import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {GoogleStrategy} from "./google.strategy";
import {UserModule} from "../user/user.module";
import {UserService} from "../user/user.service";
import {JwtStrategy} from "./jwt.strategy";

@Module({
  imports: [
      TypeOrmModule.forFeature([User]),
      JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get<string>("JWT_SECRET"),
          signOptions: {
            expiresIn: configService.get<string>("JWT_TOKEN_EXPIRE")
          }
        })
      }),
      JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
              secret: configService.get<string>("JWT_REFRESH_SECRET"),
              signOptions: {
                  expiresIn: configService.get<string>("JWT_REFRESH_EXPIRE")
              }
          }),
      }),
      UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
})
export class AuthModule {}