import {Module} from "@nestjs/common";
import {CommentController} from "./comment.controller";
import {CommentService} from "./comment.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Comment} from "../entities/comment.entity";
import {JwtStrategy} from "../auth/jwt.strategy";
import {User} from "../entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Comment, User])],
    controllers: [CommentController],
    providers: [CommentService, JwtStrategy],
})
export class CommentModule {}