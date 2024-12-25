import {ChatController} from "./chat.controller";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Chat} from "../entities/chat.entity";
import {ChatService} from "./chat.service";
import {JwtStrategy} from "../auth/jwt.strategy";

@Module({
    imports: [TypeOrmModule.forFeature([Chat])],
    controllers: [ChatController],
    providers: [ChatService, JwtStrategy],
    exports: [ChatService],
})
export class ChatModule {}