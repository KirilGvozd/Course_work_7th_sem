import {Module} from "@nestjs/common";
import {ItemController} from "./item.controller";
import {ItemService} from "./item.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Item} from "../entities/item.entity";
import {JwtStrategy} from "../auth/jwt.strategy";
import {MulterModule} from "@nestjs/platform-express";
import {MailModule} from "../mail/mail.module";
import {User} from "../entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Item, User]),
        MulterModule.register({
            dest: './uploads',
        }),
        MailModule,
    ],
    controllers: [ItemController],
    providers: [ItemService, JwtStrategy],
})
export class ItemModule {}