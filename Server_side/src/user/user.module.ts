import {Module} from "@nestjs/common";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {Item} from "../entities/item.entity";
import {MailModule} from "../mail/mail.module";

@Module({
    imports: [TypeOrmModule.forFeature([User, Item]), MailModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}