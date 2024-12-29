import {Module} from "@nestjs/common";
import {CommentController} from "./comment.controller";
import {CommentService} from "./comment.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Comment} from "../entities/comment.entity";
import {JwtStrategy} from "../auth/jwt.strategy";
import {User} from "../entities/user.entity";
import {MulterModule} from "@nestjs/platform-express";

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment, User]),
        MulterModule.register({
            dest: './uploads',
        }),
    ],
    controllers: [CommentController],
    providers: [CommentService, JwtStrategy],
})
export class CommentModule {}