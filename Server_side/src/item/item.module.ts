import {Module} from "@nestjs/common";
import {ItemController} from "./item.controller";
import {ItemService} from "./item.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Item} from "../entities/item.entity";
import {JwtStrategy} from "../auth/jwt.strategy";
import {MulterModule} from "@nestjs/platform-express";

@Module({
    imports: [
        TypeOrmModule.forFeature([Item]),
        MulterModule.register({
            dest: './uploads',
        }),
    ],
    controllers: [ItemController],
    providers: [ItemService, JwtStrategy],
})
export class ItemModule {}